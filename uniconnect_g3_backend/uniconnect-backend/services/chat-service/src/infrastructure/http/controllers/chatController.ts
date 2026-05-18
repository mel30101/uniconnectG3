import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorMiddleware';
import { GetOrCreateChat } from '../../../application/use-cases/getOrCreateChat';
import { SendMessage } from '../../../application/use-cases/sendMessage';
import { SendFileMessage } from '../../../application/use-cases/sendFileMessage';
import { GetMessages } from '../../../application/use-cases/getMessages';
import { AddReaction } from '../../../application/use-cases/addReaction';
import { MulterFile } from '../../../application/validations/BaseHandler';

interface ChatControllerDeps {
  getOrCreateChat: GetOrCreateChat;
  sendMessage: SendMessage;
  sendFileMessage: SendFileMessage;
  getMessages: GetMessages;
  addReaction: AddReaction;
}

export class ChatController {
  private getOrCreateChatUC: GetOrCreateChat;
  private sendMessageUC: SendMessage;
  private sendFileMessageUC: SendFileMessage;
  private getMessagesUC: GetMessages;
  private addReactionUC: AddReaction;

  constructor(useCases: ChatControllerDeps) {
    this.getOrCreateChatUC = useCases.getOrCreateChat;
    this.sendMessageUC = useCases.sendMessage;
    this.sendFileMessageUC = useCases.sendFileMessage;
    this.getMessagesUC = useCases.getMessages;
    this.addReactionUC = useCases.addReaction;
  }

  createChat = asyncHandler(async (req: Request, res: Response) => {
    const { userA, userB } = req.body;
    if (!userA || !userB) {
      return res.status(400).json({ error: "faltan usuarios" });
    }
    const chatId = await this.getOrCreateChatUC.execute(userA, userB);
    res.json({ chatId });
  });

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { senderId, text } = req.body;
    if (!senderId || !text) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    await this.sendMessageUC.execute(chatId as string, senderId, text);
    res.sendStatus(200);
  });

  sendFileMessage = asyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { senderId, text } = req.body;
    const file = (req as Request & { file?: MulterFile }).file;
    if (!file) {
      return res.status(400).json({ error: "Archivo no subido" });
    }
    const result = await this.sendFileMessageUC.execute(chatId as string, senderId, file, text);
    res.json(result);
  });

  getMessage = asyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const messages = await this.getMessagesUC.execute(chatId as string);
    res.json({ messages });
  });

  addReaction = asyncHandler(async (req: Request, res: Response) => {
    const { chatId, messageId } = req.params;
    const { emoji, userId } = req.body;

    if (!emoji || !userId) {
      return res.status(400).json({ error: "Datos de reacción incompletos" });
    }

    const result = await this.addReactionUC.execute(chatId as string, messageId as string, emoji, userId);
    res.json(result);
  });
}
