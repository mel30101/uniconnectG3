export interface IFileSystem {
  readAsString(uri: string): Promise<string>
  writeAsString(uri: string, content: string): Promise<void>
  uploadFile(uri: string, uploadUrl: string): Promise<{ url: string }>
}
