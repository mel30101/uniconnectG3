import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorMiddleware';

export class EventController {
  private getEventsUC: any;
  private getCategoriesUC: any;
  private subscribeToCategoryUC: any;
  private unsubscribeFromCategoryUC: any;
  private getSubscribedCategoriesUC: any;
  private createEventUC: any;

  constructor(useCases: any) {
    this.getEventsUC = useCases.getEvents;
    this.getCategoriesUC = useCases.getCategories;
    this.subscribeToCategoryUC = useCases.subscribeToCategory;
    this.unsubscribeFromCategoryUC = useCases.unsubscribeFromCategory;
    this.getSubscribedCategoriesUC = useCases.getSubscribedCategories;
    this.createEventUC = useCases.createEvent;
  }

  createEvent = asyncHandler(async (req: Request, res: Response) => {
    const eventData = req.body;
    if (!eventData.title || !eventData.type) {
      return res.status(400).json({ error: 'Faltan parámetros obligatorios (title, type)' });
    }
    const event = await this.createEventUC.execute(eventData);
    res.status(201).json(event);
  });

  getEvents = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.query.category || req.query.categoryId;
    const events = await this.getEventsUC.execute({ categoryId });
    res.status(200).json(events);
  });

  getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await this.getCategoriesUC.execute();
    res.status(200).json(categories);
  });

  subscribe = asyncHandler(async (req: Request, res: Response) => {
    const { userId, categoryId } = req.body;
    if (!userId || !categoryId) {
      return res.status(400).json({ error: 'Faltan parámetros (userId, categoryId)' });
    }

    try {
      await this.subscribeToCategoryUC.execute(userId, categoryId);
      return res.status(201).json({ message: 'Suscripción creada exitosamente' });
    } catch (err: any) {
      if (err.code === 'ALREADY_SUBSCRIBED') {
        return res.status(409).json({ error: 'El estudiante ya está suscrito a esta categoría' });
      }
      throw err;
    }
  });

  unsubscribe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const categoryId = req.query.categoryId as string;
    if (!userId || !categoryId) {
      return res.status(400).json({ error: 'Faltan parámetros (userId, categoryId)' });
    }
    await this.unsubscribeFromCategoryUC.execute(userId, categoryId);
    return res.status(204).send();
  });

  getSubscribedCategories = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'Falta userId' });
    }
    const subscriptions = await this.getSubscribedCategoriesUC.execute(userId);
    return res.status(200).json(subscriptions);
  });
}
export default EventController;
