import { IMensaje } from './IMensaje';
import { MensajeBase } from './MensajeBase';
import { MensajeConArchivo } from './decorators/MensajeConArchivo';
import { MensajeConMencion } from './decorators/MensajeConMencion';
import { MensajeConReaccion } from './decorators/MensajeConReaccion';

export class MensajeFactory {
  static create(data: any, currentUserId: string): IMensaje {
    const isOwn = data.senderId === currentUserId;
    
    // 1. Crear la base
    let mensaje: IMensaje = new MensajeBase(
      data.id,
      data.senderId,
      data.text || '',
      data.createdAt,
      isOwn
    );

    // 2. Decorar con Menciones (Detectar por texto o por metadata)
    // Se hace primero porque este decorador REEMPLAZA el renderizado de texto base
    const mentionedUserIds = data.mentionedUserIds || data.metadata?.menciones || [];
    const hasMentionInText = data.text?.includes('@');

    if (hasMentionInText || mentionedUserIds.length > 0) {
      mensaje = new MensajeConMencion(mensaje, mentionedUserIds);
    }

    // 3. Decorar con Archivo si existe
    // Se hace después para que el componente de archivo se AÑADA al texto (ya sea plano o con menciones)
    const fileUrl = data.fileUrl || data.metadata?.archivo?.url;
    const fileName = data.fileName || data.metadata?.archivo?.fileName;
    const fileSize = data.size || data.fileSize || data.metadata?.archivo?.tamano;

    if (fileUrl && fileName) {
      mensaje = new MensajeConArchivo(mensaje, fileUrl, fileName, fileSize);
    }

    // 4. Decorar con Reacciones
    const reactions = data.reacciones || data.metadata?.reacciones;
    if (reactions && Object.keys(reactions).length > 0) {
      mensaje = new MensajeConReaccion(mensaje, reactions);
    }

    return mensaje;
  }
}
