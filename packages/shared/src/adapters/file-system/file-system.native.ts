import * as FileSystem from 'expo-file-system'
import type { IFileSystem } from './types'

export const fileSystem: IFileSystem = {
  async readAsString(uri: string): Promise<string> {
    return FileSystem.readAsStringAsync(uri)
  },

  async writeAsString(uri: string, content: string): Promise<void> {
    await FileSystem.writeAsStringAsync(uri, content)
  },

  async uploadFile(uri: string, uploadUrl: string): Promise<{ url: string }> {
    const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
    })

    if (uploadResult.status !== 200) {
      throw new Error(`Upload failed with status ${uploadResult.status}`)
    }

    const result = JSON.parse(uploadResult.body)
    return { url: result.url }
  },
}
