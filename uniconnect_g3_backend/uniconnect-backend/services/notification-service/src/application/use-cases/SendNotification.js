const Notification = require('../../domain/entities/Notification');
const PrioridadDecorator = require('../../domain/decorators/PrioridadDecorator');
const AccionDecorator = require('../../domain/decorators/AccionDecorator');
const NotificationRules = require('../../domain/rules/NotificationRules');

/**
 * Context class that coordinates multiple notification strategies.
 * Implements Strategy pattern to decouple what is sent from how it is sent.
 */
class SendNotification {
  constructor(strategies, preferenceRepo) {
    this.strategies = strategies; // Array of INotificacionStrategy
    this.preferenceRepo = preferenceRepo;
  }

  async execute(notificationData) {
    console.log(`[Notification] Processing event for user ${notificationData.userId}: ${notificationData.title}`);

    try {
      // 1. Get user preferences (Criterio 4 preparation)
      const preferences = await this.preferenceRepo.getPreferences(notificationData.userId);
      
      // Determine rules based on type
      const rule = NotificationRules[notificationData.type] || { priority: 'normal', requiresAction: false };
      
      // 2. Prepare the processed DTO using current Decorator logic
      let notificacion = new Notification({
        ...notificationData,
        status: 'unread',
        createdAt: new Date()
      });

      // Apply automatic priority decorator based on catalog
      notificacion = new PrioridadDecorator(notificacion, rule.priority);

      // Apply automatic action decorator if required by rule or if explicitly provided
      if (rule.requiresAction) {
        const actionData = notificationData.action || {
          label: 'Ver Detalles',
          endpoint: '/default-endpoint',
          token: null
        };
        notificacion = new AccionDecorator(notificacion, actionData);
      } else if (notificationData.action) {
        notificacion = new AccionDecorator(notificacion, notificationData.action);
      }

      const finalDTO = notificacion.getDTO();

      // 3. Execute strategies with Filtering and Resilience (Criterio 4 & 5)
      const executionResults = [];
      
      for (const strategy of this.strategies) {
        // Criterio 4: Filtering based on preferences
        // We check if the channel is enabled globally for the user.
        // If event-specific overrides are added in the future, they would be checked here.
        let isEnabled = preferences.enabledChannels[strategy.canal] ?? true;
        
        // Override logic para notificaciones críticas
        if (finalDTO.priority === 'critica') {
          console.log(`[Notification] OVERRIDE: Priority is critica. Forcing dispatch via ${strategy.canal}`);
          isEnabled = true;
        }
        
        if (!isEnabled) {
          console.log(`[Notification] Channel ${strategy.canal} is disabled for user ${notificationData.userId}. Skipping.`);
          continue;
        }

        // Criterio 5: Resilience (Fault Isolation)
        try {
          const result = await strategy.enviar(finalDTO);
          executionResults.push(result);
        } catch (strategyError) {
          console.error(`[Notification] Critical failure in ${strategy.canal} strategy:`, strategyError.message);
          
          // We register the failure but continue with other strategies
          executionResults.push({
            canal: strategy.canal,
            enviado: false,
            error: 'ISOLATED_STRATEGY_FAILURE'
          });
        }
      }

      console.log(`[Notification] Processing complete for ${notificationData.userId}. Results: ${executionResults.length} channels processed.`);
      
      return { 
        success: true, 
        results: executionResults, 
        notification: finalDTO 
      };

    } catch (error) {
      console.error('[Notification] Error in strategy execution flow:', error.message);
      throw new Error(`Notification sending failed: ${error.message}`);
    }
  }
}

module.exports = SendNotification;
