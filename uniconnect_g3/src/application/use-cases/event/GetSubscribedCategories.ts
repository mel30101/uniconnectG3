import { IEventRepository } from '../../../domain/repositories/IEventRepository';

export class GetSubscribedCategories {
    constructor(private eventRepo: IEventRepository) { }

    async execute(userId: string) {
        return this.eventRepo.getSubscribedCategories(userId);
    }
}