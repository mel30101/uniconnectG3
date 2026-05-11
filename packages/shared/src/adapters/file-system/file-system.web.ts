import type { IFileSystem } from './types'

export const fileSystem: IFileSystem = {
  async readAsString(uri: string): Promise<string> {
    const response = await fetch(uri)
    if (!response.ok) throw new Error(`Failed to read file: ${response.statusText}`)
    return response.text()
  },

  async writeAsString(_uri: string, _content: string): Promise<void> {
    throw new Error('writeAsString not supported in web environment')
  },

  async uploadFile(uri: string, uploadUrl: string): Promise<{ url: string }> {
    const response = await fetch(uri)
    const blob = await response.blob()
    
    const formData = new FormData()
    formData.append('file', blob)

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`)
    }

    const result = await uploadResponse.json()
    return { url: result.url }
  },
}
