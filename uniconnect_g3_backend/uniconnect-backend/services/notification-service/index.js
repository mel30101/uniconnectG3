const admin = require('firebase-admin');
const dotenv = require('dotenv');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

dotenv.config();

// Infrastructure
const FirestoreNotificationRepository = require('./src/infrastructure/repositories/FirestoreNotificationRepository');
const FirestoreTokenRepository = require('./src/infrastructure/repositories/FirestoreTokenRepository');
const FirestorePreferenceRepository = require('./src/infrastructure/repositories/FirestorePreferenceRepository');

// Strategies
const InAppWebSocketStrategy = require('./src/infrastructure/strategies/InAppWebSocketStrategy');
const PushMovilStrategy = require('./src/infrastructure/strategies/PushMovilStrategy');
const EmailInstitucionalStrategy = require('./src/infrastructure/strategies/EmailInstitucionalStrategy');
const ResumenDiarioStrategy = require('./src/infrastructure/strategies/ResumenDiarioStrategy');

// Application
const SendNotification = require('./src/application/use-cases/SendNotification');
const NotificationObserver = require('./src/application/observers/NotificationObserver');
const MarkNotificationAsRead = require('./src/application/use-cases/MarkNotificationAsRead');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf8')
    : (process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined);

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
}

// HTTP Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
app.use(express.json());

const db = admin.firestore();

// Dependency Injection (Criterio 3 - Strategy Pattern)
const notificationRepo = new FirestoreNotificationRepository(db);
const tokenRepo = new FirestoreTokenRepository(db);
const preferenceRepo = new FirestorePreferenceRepository(db);

const strategies = [
  new InAppWebSocketStrategy(notificationRepo, io),
  new PushMovilStrategy(tokenRepo),
  new EmailInstitucionalStrategy(),
  new ResumenDiarioStrategy(db)
];

const sendNotificationUseCase = new SendNotification(strategies, preferenceRepo);
const notificationObserver = new NotificationObserver(sendNotificationUseCase);
const markNotificationAsReadUseCase = new MarkNotificationAsRead(notificationRepo);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'notification-service' 
  });
});

const PORT = process.env.NOTIFICATION_PORT || 3006;

// ─── POST /notify ─────────────────────────────────────────────
// Recibe eventos de otros microservicios y persiste la notificación
app.post('/notify', async (req, res) => {
  const { event, payload } = req.body;
  try {
    let result;
    switch (event) {
      case 'SOLICITUD_INGRESO':
        result = await notificationObserver.onGroupRequest(
          payload.targetUserId, payload.userName, payload.groupName, payload.groupId, payload.requestId
        );
        break;
      case 'SOLICITUD_ACEPTADA':
        result = await notificationObserver.onGroupRequestHandled(
          payload.userId, true, payload.groupName, payload.groupId
        );
        break;
      case 'SOLICITUD_RECHAZADA':
        result = await notificationObserver.onGroupRequestHandled(
          payload.userId, false, payload.groupName, payload.groupId
        );
        break;
      case 'TRANSFER_ADMIN':
        result = await notificationObserver.onAdminTransfer(
          payload.userId, payload.groupName, payload.groupId
        );
        break;
      case 'TRANSFER_ADMIN_SOLICITADA':
        result = await notificationObserver.onAdminTransferRequested(
          payload.userId, payload.userName, payload.groupName, payload.groupId
        );
        break;
      case 'TRANSFER_ADMIN_ACEPTADA':
        result = await notificationObserver.onAdminTransferAccepted(
          payload.userId, payload.userName, payload.groupName, payload.groupId
        );
        break;
      case 'TRANSFER_ADMIN_RECHAZADA':
        result = await notificationObserver.onAdminTransferRejected(
          payload.userId, payload.userName, payload.groupName, payload.groupId
        );
        break;
      case 'MENCION':
        result = await notificationObserver.onMention(
          payload.userId, payload.senderName, payload.groupName, payload.message, payload.groupId
        );
        break;
      case 'NUEVO_EVENTO':
        result = await notificationObserver.onNewEvent(
          payload.userId, payload.categoryName, payload.eventTitle, payload.eventId
        );
        break;
      default:
        return res.status(400).json({ error: `Unknown event type: ${event}` });
    }
    res.json({ success: true, result });
  } catch (error) {
    console.error('[NotificationService] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /notifications/:userId ───────────────────────────────
// Devuelve el historial de notificaciones del usuario (para mobile y web)
app.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const requestedLimit = parseInt(req.query.limit) || 20;
    const limit = Math.min(requestedLimit, 50); // Límite máximo de 50 para Criterio 5
    const notifications = await notificationRepo.findByUserId(userId, limit);
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('[NotificationService] Error getting notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /notifications/:userId/unread-count ──────────────────
// Devuelve el número de notificaciones no leídas de un usuario
app.get('/notifications/:userId/unread-count', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await notificationRepo.countUnread(userId);
    res.json({ success: true, unreadCount: count });
  } catch (error) {
    console.error('[NotificationService] Error counting unread notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── PATCH /notifications/:id/read ────────────────────────────
// Marca una notificación como leída
app.patch('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const authUserId = req.body.authUserId || req.body.userId;
    
    if (!authUserId) {
      return res.status(400).json({ error: 'Falta authUserId en el cuerpo de la petición' });
    }

    await markNotificationAsReadUseCase.execute(id, authUserId);
    res.json({ success: true });
  } catch (error) {
    console.error('[NotificationService] Error marking as read:', error);
    const status = error.message === 'UNAUTHORIZED' ? 403 : (error.message === 'NOTIFICATION_NOT_FOUND' ? 404 : 500);
    res.status(status).json({ error: error.message });
  }
});

// ─── PATCH /notifications/user/:userId/read-all ───────────────
// Marca todas las notificaciones de un usuario como leídas
app.patch('/notifications/user/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    await notificationRepo.markAllAsRead(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('[NotificationService] Error marking all as read:', error);
    res.status(500).json({ error: error.message });
  }
});

const { startDailySummaryJob } = require('./src/infrastructure/jobs/dailySummaryJob');

server.listen(PORT, () => {
  console.log(`🔔 Notification Service (Dashboard) running on port ${PORT}`);
  // Iniciamos el cron job del resumen diario
  startDailySummaryJob();
});

module.exports = { notificationObserver };
