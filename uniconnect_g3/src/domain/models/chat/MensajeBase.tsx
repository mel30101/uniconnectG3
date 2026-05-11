import { ReactNode } from 'react';
import { IMensaje } from './IMensaje';
import { Text } from 'react-native';

export class MensajeBase implements IMensaje {
  constructor(
    private id: string,
    private senderId: string,
    private text: string,
    private createdAt: any,
    private isOwn: boolean
  ) {}

  getContenido(): string {
    return this.text;
  }

  getMetadata(): any {
    return {
      id: this.id,
      senderId: this.senderId,
      createdAt: this.createdAt,
      isOwn: this.isOwn
    };
  }

  render(): ReactNode {
    return (
      <Text style={{ color: this.isOwn ? '#fff' : '#000' }}>
        {this.text}
      </Text>
    );
  }
}
