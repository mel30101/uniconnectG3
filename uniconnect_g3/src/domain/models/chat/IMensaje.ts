import { ReactNode } from 'react';

export interface IMensaje {
  getContenido(): string;
  getMetadata(): any;
  render(): ReactNode;
}
