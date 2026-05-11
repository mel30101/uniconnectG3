import { IEventRepository } from '../../../domain/repositories/IEventRepository';

export class UnsubscribeFromCategory {
    constructor(private eventRepo: IEventRepository) { }

    async execute(userId: string, categoryId: string) {
        return this.eventRepo.unsubscribeFromCategory(userId, categoryId);
    }
}