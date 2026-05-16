const cron = require('node-cron');
const admin = require('firebase-admin');

// Simulación de envío
function enviarEmailResumen(userId, contenido) {
  console.log(`\n📧 [EMAIL RESUMEN SIMULADO] -> Para: ${userId}`);
  console.log(`====================================================`);
  console.log(contenido);
  console.log(`====================================================\n`);
}

async function processDailySummary() {
  console.log('[DailySummaryJob] 🔄 Iniciando procesamiento del buffer diario...');
  const db = admin.firestore();
  
  try {
    const dailyBufferRef = db.collection('daily_buffer');
    const usersSnapshot = await dailyBufferRef.get();

    if (usersSnapshot.empty) {
      console.log('[DailySummaryJob] No hay usuarios en el buffer diario.');
      return;
    }

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      try {
        const notificationsRef = userDoc.ref.collection('notifications');
        const notificationsSnapshot = await notificationsRef.get();

        if (notificationsSnapshot.empty) {
          continue;
        }

        let totalMessages = 0;
        let totalMentions = 0;
        let totalEvents = 0;
        let other = 0;

        const batch = db.batch();

        notificationsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.type === 'NUEVO_MENSAJE') totalMessages++;
          else if (data.type === 'MENCION') totalMentions++;
          else if (data.type === 'NUEVO_EVENTO') totalEvents++;
          else other++;

          // Preparamos el documento para ser eliminado atómicamente
          batch.delete(doc.ref);
        });

        // 1. Agrupación y formateo del contenido
        const contenido = `Hola,\nAquí tienes tu resumen diario en UniConnect:\n` +
          `- 💬 ${totalMessages} mensajes nuevos.\n` +
          `- 🔔 ${totalMentions} menciones en grupos.\n` +
          `- 📅 ${totalEvents} eventos nuevos.\n` +
          `- 📌 ${other} otras notificaciones.\n\n` +
          `¡Revisa la plataforma para más detalles!`;

        // 2. Simulación de Envío
        enviarEmailResumen(userId, contenido);

        // 3. Operación Atómica de Limpieza (Batch Write)
        await batch.commit();
        
        console.log(`[DailySummaryJob] ✅ Resumen enviado y buffer limpiado para ${userId}`);
      } catch (userError) {
        // Manejo de Errores: si falla un usuario, registramos y continuamos con el siguiente
        console.error(`[DailySummaryJob] ❌ Error procesando al usuario ${userId}:`, userError.message);
      }
    }
    
    console.log('[DailySummaryJob] 🏁 Procesamiento del resumen diario finalizado.');
  } catch (error) {
    console.error('[DailySummaryJob] Error global en el job:', error.message);
  }
}

function startDailySummaryJob() {
  // Ejecutar todos los días a las 20:00 (8:00 PM) usando node-cron
  cron.schedule('0 20 * * *', () => {
    processDailySummary();
  });
  console.log('⏰ Daily Summary Job programado para ejecutarse a las 20:00 diariamente.');
}

module.exports = {
  startDailySummaryJob,
  processDailySummary // Exportado para permitir pruebas manuales
};
