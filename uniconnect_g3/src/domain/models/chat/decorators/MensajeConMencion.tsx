import React from 'react';
import { ReactNode } from 'react';
import { Text } from 'react-native';
import { MensajeDecorator } from '../MensajeDecorator';

export class MensajeConMencion extends MensajeDecorator {
  constructor(
    mensaje: any,
    private mentionedUserIds: string[]
  ) {
    super(mensaje);
  }

  getMetadata(): any {
    return {
      ...super.getMetadata(),
      mentionedUserIds: this.mentionedUserIds,
      hasMention: true
    };
  }

  render(): ReactNode {
    const text = this.getContenido();
    const isOwn = this.getMetadata().isOwn;
    
    if (!text) return super.render();

    // Regex que busca palabras que empiecen por @ (incluye letras y números)
    // Usamos captura () para mantener el delimitador en el split
    const parts = text.split(/(@\w+)/g);
    
    return (
      <Text style={{ color: isOwn ? '#fff' : '#000' }}>
        {parts.map((part, i) => {
          if (part.startsWith('@')) {
            return (
              <Text key={i} style={{ 
                fontWeight: 'bold', 
                color: isOwn ? '#fde047' : '#ef4444', 
              }}>
                {part}
              </Text>
            );
          }
          return <Text key={i}>{part}</Text>;
        })}
      </Text>
    );
  }
}
