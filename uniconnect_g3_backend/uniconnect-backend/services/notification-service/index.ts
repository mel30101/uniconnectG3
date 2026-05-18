import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as http from 'http';
import express, { Request, Response } from 'express';
import { Server } from 'socket.io';

dotenv.config();

// Infrastructure
import { FirestoreNotificationRepository } from './src/infrastructure/repositories/FirestoreNotificationRepository';
import { FirestoreTokenRepository } from './src/infrastructure/repositories/FirestoreTokenRepository';
import { FirestorePreferenceRepository } from './src/infrastructure/repositories/FirestorePreferenceRepository';

// Strategies
import { InAppWebSocketStrategy } from './src/infrastructure/strategies/InAppWebSocketStrategy';
import { PushMovilStrategy } from './src/infrastructure/strategies/PushMovilStrategy';
import { EmailInstitucionalStrategy } from './src/infrastructure/strategies/EmailInstitucionalStrategy';
import { ResumenDiarioStrategy } from './src/infrastructure/strategies/ResumenDiarioStrategy';

// Application
import { SendNotification } from './src/application/use-cases/SendNotification';
import { NotificationObserver, NotificationResult } from './src/application/observers/NotificationObserver';
import { MarkNotificationAsRead } from './src/application/use-cases/MarkNotificationAsRead';

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

// Dependency Injection
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

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'notification-service' 
  });
  return;
});

const PORT = process.env.NOTIFICATION_PORT || 3006;

// ─── POST /notify ─────────────────────────────────────────────
app.post('/notify', async (req: Request, res: Response) => {
  const { event, payload } = req.body;
  try {
    let result: NotificationResult | undefined;
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
        res.status(400).json({ error: `Unknown event type: ${event}` });
        return;
    }
    res.json({ success: true, result });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[NotificationService] Error:', error);
    res.status(500).json({ error: errMsg });
  }
});

// ─── GET /notifications/:userId ───────────────────────────────
app.get('/notifications/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const requestedLimit = parseInt(req.query.limit as string) || 20;
    const limit = Math.min(requestedLimit, 50);
    const notifications = await notificationRepo.findByUserId(userId, limit);
    res.json({ success: true, data: notifications });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[NotificationService] Error getting notifications:', error);
    res.status(500).json({ error: errMsg });
  }
});

// ─── GET /notifications/:userId/unread-count ──────────────────
app.get('/notifications/:userId/unread-count', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const count = await notificationRepo.countUnread(userId);
    res.json({ success: true, unreadCount: count });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[NotificationService] Error counting unread notifications:', error);
    res.status(500).json({ error: errMsg });
  }
});

// ─── PATCH /notifications/:id/read ────────────────────────────
app.patch('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const authUserId = req.body.authUserId || req.body.userId;
    
    if (!authUserId) {
      res.status(400).json({ error: 'Falta authUserId en el cuerpo de la petición' });
      return;
    }

    await markNotificationAsReadUseCase.execute(id, authUserId);
    res.json({ success: true });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[NotificationService] Error marking as read:', error);
    const status = errMsg === 'UNAUTHORIZED' ? 403 : (errMsg === 'NOTIFICATION_NOT_FOUND' ? 404 : 500);
    res.status(status).json({ error: errMsg });
  }
});

// ─── PATCH /notifications/user/:userId/read-all ───────────────
app.patch('/notifications/user/:userId/read-all', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    await notificationRepo.markAllAsRead(userId);
    res.json({ success: true });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[NotificationService] Error marking all as read:', error);
    res.status(500).json({ error: errMsg });
  }
});

import { startDailySummaryJob } from './src/infrastructure/jobs/dailySummaryJob';

server.listen(PORT, () => {
  console.log(`🔔 Notification Service (Dashboard) running on port ${PORT}`);
  startDailySummaryJob();
});

export { notificationObserver };
