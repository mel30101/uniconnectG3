import { IEventRepository } from '../../../domain/repositories/IEventRepository';

export class GetEvents {
  constructor(private eventRepo: IEventRepository) { }

  async execute(categoryId?: string) {
    return this.eventRepo.getEvents(categoryId);
  }
}