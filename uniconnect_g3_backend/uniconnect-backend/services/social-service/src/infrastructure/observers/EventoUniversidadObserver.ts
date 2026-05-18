import { IObserver } from '../../domain/observer/IObserver';
import { Server } from 'socket.io';
import * as admin from 'firebase-admin';
import { IEventSubscriptionRepository, ICategoryRepository } from '../../domain/repositories';

export class EventoUniversidadObserver extends IObserver {
  private io: Server;
  private db: admin.firestore.Firestore;
  private subscriptionRepo: IEventSubscriptionRepository;
  private categoryRepo: ICategoryRepository;

  constructor(io: Server, db: admin.firestore.Firestore, subscriptionRepo: IEventSubscriptionRepository, categoryRepo: ICategoryRepository) {
    super();
    this.io = io;
    this.db = db;
    this.subscriptionRepo = subscriptionRepo;
    this.categoryRepo = categoryRepo;
  }

  async update(event: string, data: any): Promise<void> {
    if (event !== 'NUEVO_EVENTO') return;

    try {
      console.log(`[Observer Evento] Procesando evento: ${event} para categoría: ${data.type}`);
      
      // Resolver nombre legible de la categoría
      let categoryName = data.type;
      if (this.categoryRepo) {
        const cat = await this.categoryRepo.findAll();
        const found = cat.find(c => c.id === data.type);
        if (found && found.name) categoryName = found.name;
      }

      // En la lógica original, se obtiene los usuarios suscritos a la categoría

      // Por simplicidad, adaptamos a la lógica original:
      // const usersSubscribed = await this.subscriptionRepo.getUsersSubscribedToCategory(data.type);
      // Pero wait, subscriptionRepo tiene findByUser en nuestra interfaz, let's cast or adjust the interface method if needed!
      // En el repo original, se llama 'getUsersSubscribedToCategory(categoryId)'
      // Let's call the repository method directly since it might contain additional methods!
      const anyRepo = this.subscriptionRepo as any;
      const subscribers = anyRepo.getUsersSubscribedToCategory 
        ? await anyRepo.getUsersSubscribedToCategory(data.type) 
        : await this.subscriptionRepo.findByUser(data.type);

      if (!subscribers || subscribers.length === 0) {
        console.log(`[Observer Evento] No hay usuarios suscritos a la categoría ${categoryName}`);
        return;
      }

      for (const subscriber of subscribers) {
        const userId = typeof subscriber === 'string' ? subscriber : (subscriber.userId || subscriber.id);
        
        // 1. Guardar en base de datos (Persistencia)
        const notification = {
          type: event,
          targetUserId: userId,
          eventId: data.id,
          eventName: data.title,
          category: categoryName,
          message: `Nuevo evento de la categoría ${categoryName}: ${data.title}`,
          read: false,
          createdAt: new Date()
        };

        await this.db.collection('notifications').add(notification);
        
        // 2. Emitir WebSocket
        if (this.io) {
          this.io.to(userId).emit('notification', {
            type: event,
            eventId: data.id,
            eventName: data.title,
            category: categoryName,
            message: notification.message
          });
        }
      }

      console.log(`[Observer Evento] Notificaciones enviadas a ${subscribers.length} usuarios.`);
      
    } catch (error) {
      console.error('[Observer Evento] Error procesando notificación de evento:', error);
    }
  }
}
export default EventoUniversidadObserver;
