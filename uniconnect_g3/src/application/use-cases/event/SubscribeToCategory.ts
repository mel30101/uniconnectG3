import { IEventRepository } from '../../../domain/repositories/IEventRepository';

export class SubscribeToCategory {
    constructor(private eventRepo: IEventRepository) { }

    async execute(userId: string, categoryId: string) {
        return this.eventRepo.subscribeToCategory(userId, categoryId);
    }
}