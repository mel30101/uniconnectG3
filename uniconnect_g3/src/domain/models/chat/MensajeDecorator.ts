import { ReactNode } from 'react';
import { IMensaje } from './IMensaje';

export abstract class MensajeDecorator implements IMensaje {
  constructor(protected mensaje: IMensaje) {}

  getContenido(): string {
    return this.mensaje.getContenido();
  }

  getMetadata(): any {
    return this.mensaje.getMetadata();
  }

  render(): ReactNode {
    return this.mensaje.render();
  }
}
