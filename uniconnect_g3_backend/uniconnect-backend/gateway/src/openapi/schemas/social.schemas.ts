import { registry } from '../registry';
import { z } from 'zod';
import {
  CreateGroupRequestSchema,
  JoinGroupRequestSchema,
  HandleJoinRequestSchema,
  TransferAdminRequestSchema,
  AdminTransferResponseSchema,
  CreateEventRequestSchema,
  SubscribeCategoryRequestSchema,
  GroupSchema,
  EventSchema,
  CategorySchema
} from '../../../../services/social-service/src/domain/dtos/schemas';

// Register models
const OpenAPIGroup = registry.register('Group', GroupSchema);
const OpenAPIEvent = registry.register('Event', EventSchema);
const OpenAPICategory = registry.register('Category', CategorySchema);

const OpenAPICreateGroupRequest = registry.register('CreateGroupRequest', CreateGroupRequestSchema);
const OpenAPIJoinGroupRequest = registry.register('JoinGroupRequest', JoinGroupRequestSchema);
const OpenAPIHandleJoinRequest = registry.register('HandleJoinRequest', HandleJoinRequestSchema);
const OpenAPITransferAdminRequest = registry.register('TransferAdminRequest', TransferAdminRequestSchema);
const OpenAPIAdminTransferResponse = registry.register('AdminTransferResponse', AdminTransferResponseSchema);
const OpenAPICreateEventRequest = registry.register('CreateEventRequest', CreateEventRequestSchema);
const OpenAPISubscribeCategoryRequest = registry.register('SubscribeCategoryRequest', SubscribeCategoryRequestSchema);

// Paths
registry.registerPath({
  method: 'post',
  path: '/api/groups',
  summary: 'Crear un nuevo grupo de estudio',
  tags: ['Social - Grupos'],
  request: {
    body: {
      content: {
        'application/json': { schema: OpenAPICreateGroupRequest }
      }
    }
  },
  responses: {
    201: {
      description: 'Grupo creado',
      content: { 'application/json': { schema: OpenAPIGroup } }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/groups/{id}/join-requests',
  summary: 'Enviar solicitud de unión al grupo',
  tags: ['Social - Grupos'],
  request: {
    params: z.object({ id: z.string().openapi({ description: 'ID del grupo' }) }),
    body: {
      content: { 'application/json': { schema: OpenAPIJoinGroupRequest } }
    }
  },
  responses: {
    200: { description: 'Solicitud enviada' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/events',
  summary: 'Crear un evento universitario',
  tags: ['Social - Eventos'],
  request: {
    body: {
      content: { 'application/json': { schema: OpenAPICreateEventRequest } }
    }
  },
  responses: {
    201: {
      description: 'Evento creado',
      content: { 'application/json': { schema: OpenAPIEvent } }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/events/subscribe',
  summary: 'Suscribirse a categoría de eventos',
  tags: ['Social - Eventos'],
  request: {
    body: {
      content: { 'application/json': { schema: OpenAPISubscribeCategoryRequest } }
    }
  },
  responses: {
    200: { description: 'Suscripción exitosa' }
  }
});
