import { IEventRepository } from '../../../domain/repositories/IEventRepository';

export class GetEventCategories {
    constructor(private eventRepo: IEventRepository) { }

    async execute() {
        return this.eventRepo.getCategories();
    }
}