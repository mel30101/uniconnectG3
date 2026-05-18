import { Request, Response } from 'express';
import { SendGroupMessage } from '../../../application/use-cases/sendGroupMessage';
import { AddGroupReaction } from '../../../application/use-cases/addGroupReaction';
import { MulterFile } from '../../../application/validations/BaseHandler';

interface GroupChatControllerDeps {
  sendGroupMessage: SendGroupMessage;
  addGroupReaction: AddGroupReaction;
}

export class GroupChatController {
  private sendGroupMessage: SendGroupMessage;
  private addGroupReactionUC: AddGroupReaction;

  constructor({ sendGroupMessage, addGroupReaction }: GroupChatControllerDeps) {
    this.sendGroupMessage = sendGroupMessage;
    this.addGroupReactionUC = addGroupReaction;

    // Bind this para asegurar el contexto de ejecución
    this.sendMessage = this.sendMessage.bind(this);
    this.sendFileMessage = this.sendFileMessage.bind(this);
    this.addGroupReaction = this.addGroupReaction.bind(this);
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const { senderId, text } = req.body;

      if (!groupId || !senderId || !text) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos (groupId, senderId, text)' });
      }

      const result = await this.sendGroupMessage.execute(groupId as string, senderId, { text, type: 'text' });
      res.status(201).json(result);
    } catch (error) {
      console.error('Error sending group message:', error);
      res.status(500).json({ error: 'Error al enviar mensaje grupal' });
    }
  }

  async sendFileMessage(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const { senderId, text } = req.body;
      const file = (req as Request & { file?: MulterFile }).file;

      if (!groupId || !senderId || !file) {
        return res.status(400).json({ error: 'Faltan parámetros (groupId, senderId, file)' });
      }

      const result = await this.sendGroupMessage.execute(groupId as string, senderId, { text }, file);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error sending group file message:', error);
      res.status(500).json({ error: 'Error al enviar archivo en grupo' });
    }
  }

  async addGroupReaction(req: Request, res: Response) {
    try {
      const { groupId, messageId } = req.params;
      const { emoji, userId } = req.body;

      if (!groupId || !messageId || !emoji || !userId) {
        return res.status(400).json({ error: 'Faltan parámetros (groupId, messageId, emoji, userId)' });
      }

      const result = await this.addGroupReactionUC.execute(groupId as string, messageId as string, emoji, userId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error adding group reaction:', error);
      res.status(500).json({ error: 'Error al reaccionar al mensaje' });
    }
  }
}
