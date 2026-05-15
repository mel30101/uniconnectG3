const NotificationRules = {
  NUEVO_MENSAJE: { priority: 'normal' },
  MENCION: { priority: 'normal' },
  MIEMBRO_ACEPTADO: { priority: 'normal' },
  MIEMBRO_RECHAZADO: { priority: 'normal' },
  SOLICITUD_INGRESO: { priority: 'urgente', requiresAction: true },
  NUEVO_EVENTO: { priority: 'urgente' },
  TRANSFERENCIA_ADMIN: { priority: 'critica' },
  TRANSFERENCIA_ADMIN_SOLICITADA: { priority: 'critica', requiresAction: true },
  TRANSFERENCIA_ADMIN_ACEPTADA: { priority: 'normal' },
  TRANSFERENCIA_ADMIN_RECHAZADA: { priority: 'normal' }
};

module.exports = NotificationRules;
