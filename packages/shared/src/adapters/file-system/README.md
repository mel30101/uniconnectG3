# File System Adapter - Guía de Uso

## Importación

```typescript
import { fileSystem, IS_WEB, IS_NATIVE } from '@uniconnect/shared';
```

## Métodos Disponibles

### `readAsString(uri: string): Promise<string>`

Lee el contenido de un archivo como string.

**Web:** Usa `fetch()` para leer el archivo desde una URL.
**Native:** Usa `FileSystem.readAsStringAsync()` de Expo.

```typescript
try {
  const content = await fileSystem.readAsString('file:///path/to/file.txt');
  console.log('File content:', content);
} catch (error) {
  console.error('Failed to read file:', error);
}
```

### `writeAsString(uri: string, content: string): Promise<void>`

Escribe contenido en un archivo.

**Web:** ❌ No soportado (lanza error).
**Native:** ✅ Usa `FileSystem.writeAsStringAsync()` de Expo.

```typescript
if (IS_NATIVE) {
  try {
    await fileSystem.writeAsString('file:///path/to/file.txt', 'Hello World');
    console.log('File written successfully');
  } catch (error) {
    console.error('Failed to write file:', error);
  }
} else {
  console.warn('writeAsString not supported on web');
}
```

### `uploadFile(uri: string, uploadUrl: string): Promise<{ url: string }>`

Sube un archivo a un servidor.

**Web:** Usa `fetch()` con `FormData` multipart.
**Native:** Usa `FileSystem.uploadAsync()` de Expo.

```typescript
try {
  const result = await fileSystem.uploadFile(
    'file:///path/to/image.jpg',
    'https://api.example.com/upload'
  );
  console.log('File uploaded:', result.url);
} catch (error) {
  console.error('Failed to upload file:', error);
}
```

## Ejemplo Completo: Upload de Avatar

```typescript
import { fileSystem } from '@uniconnect/shared';
import { apiClient } from '@uniconnect/shared/api';

async function uploadAvatar(localUri: string): Promise<string> {
  try {
    // 1. Obtener URL de upload del backend
    const { data } = await apiClient.get<{ uploadUrl: string }>('/api/upload/avatar');
    
    // 2. Subir archivo usando el adaptador
    const result = await fileSystem.uploadFile(localUri, data.uploadUrl);
    
    // 3. Retornar URL pública del archivo
    return result.url;
  } catch (error) {
    console.error('Avatar upload failed:', error);
    throw error;
  }
}

// Uso en componente
const handleAvatarChange = async (uri: string) => {
  try {
    const avatarUrl = await uploadAvatar(uri);
    // Actualizar perfil con nueva URL
    await updateProfile({ photoURL: avatarUrl });
  } catch (error) {
    alert('Failed to upload avatar');
  }
};
```

## Detección de Plataforma

Si necesitas lógica condicional basada en la plataforma:

```typescript
import { IS_WEB, IS_NATIVE } from '@uniconnect/shared';

if (IS_WEB) {
  // Lógica específica de web
  console.log('Running on web browser');
} else if (IS_NATIVE) {
  // Lógica específica de React Native
  console.log('Running on React Native');
}
```

## Notas Importantes

1. **URIs en Web vs Native:**
   - Web: Usa URLs HTTP/HTTPS (`https://example.com/file.txt`)
   - Native: Usa URIs de file system (`file:///path/to/file.txt`)

2. **writeAsString en Web:**
   - No está soportado por limitaciones del navegador
   - Usa `localStorage` o `IndexedDB` para persistencia en web

3. **Permisos en Native:**
   - Asegúrate de solicitar permisos de file system antes de usar el adaptador
   - Usa `expo-file-system` permissions API

4. **Tipos de Archivo:**
   - El adaptador no valida tipos de archivo
   - Implementa validación en tu lógica de negocio si es necesario

## Próximos Adaptadores

Este patrón se replicará para:
- **Camera:** `expo-camera` (web: `getUserMedia`)
- **Image Picker:** `expo-image-picker` (web: `<input type="file">`)
- **Notifications:** `expo-notifications` (web: Web Push API)
- **Storage:** `expo-secure-store` (web: `localStorage` / `IndexedDB`)
