import React from 'react';
import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { MensajeDecorator } from '../MensajeDecorator';

interface ReaccionData {
  [emoji: string]: {
    count: number;
    users: string[];
  };
}

export class MensajeConReaccion extends MensajeDecorator {
  constructor(
    mensaje: any,
    private reacciones: ReaccionData
  ) {
    super(mensaje);
  }

  getMetadata(): any {
    return {
      ...super.getMetadata(),
      reacciones: this.reacciones
    };
  }

  render(): ReactNode {
    const emojis = Object.keys(this.reacciones);

    return (
      <View>
        {super.render()}
        {emojis.length > 0 && (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 4,
            gap: 4
          }}>
            {emojis.map(emoji => (
              <View key={emoji} style={{
                backgroundColor: 'rgba(255,255,255,0.2)', // Fondo claro translúcido
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 2,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.3)'
              }}>
                <Text style={{ fontSize: 12 }}>{emoji}</Text>
                <Text style={{
                  fontSize: 10,
                  marginLeft: 2,
                  fontWeight: 'bold',
                  color: '#eb3434ff' // BLANCO PURO
                }}>
                  {this.reacciones[emoji].count}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
}
