import type { IFileSystem } from './types'

// Este archivo es un stub para compilación TypeScript
// En runtime, será reemplazado por file-system.web.ts o file-system.native.ts
// según la configuración de resolución de módulos (Vite/Metro)

export const fileSystem: IFileSystem = {
  async readAsString(_uri: string): Promise<string> {
    throw new Error('fileSystem not implemented for this platform')
  },

  async writeAsString(_uri: string, _content: string): Promise<void> {
    throw new Error('fileSystem not implemented for this platform')
  },

  async uploadFile(_uri: string, _uploadUrl: string): Promise<{ url: string }> {
    throw new Error('fileSystem not implemented for this platform')
  },
}
