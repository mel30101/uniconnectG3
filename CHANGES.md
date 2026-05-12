# CHANGES

## [REFACTOR] Presencia online — migración a WebSocket del backend

**Fecha:** 2026-05-11  
**Commit:** `feat(chat): presencia en tiempo real via WebSocket del chat-service`

**Archivos modificados:**
- `uniconnect_web/src/hooks/usePresence.ts`
- `uniconnect_web/src/context/SocketContext.tsx`
- `uniconnect_web/src/routes/chat/index.tsx`
- `uniconnect_g3/src/presentation/hooks/usePresence.ts`
- `uniconnect_g3/src/presentation/hooks/useChatSocket.ts` *(nuevo)*
- `uniconnect_g3/app/chat/[chatId].tsx`

### Antes

Presencia con Firestore: `setDoc` a `presence/{userId}` al conectar/desconectar.  
Dependía de `AppState` (mobile) y `visibilitychange` (web) para detectar cambios de estado.  
`useOtherPresence` usaba `onSnapshot` de Firestore para leer el estado del otro usuario.

### Después

Presencia con WebSocket del chat-service (puerto 3004):
- `check_user_status`: consulta inicial al montar el componente (callback/ack)
- `USER_STATUS_CHANGED`: actualizaciones en tiempo real
- El backend gestiona `activeUsers` Map automáticamente al conectar/desconectar el socket
- `useMyPresence` queda vacío: el backend registra presencia al recibir la conexión con `userId` en el handshake query

### Evento del backend (confirmado en `chat-service/index.js`)

- **Nombre:** `USER_STATUS_CHANGED`
- **Payload:** `{ userId: string, status: 'online' | 'offline' }`
- **Emisión:** segmentada a los grupos del usuario (con fallback a broadcast global si falla)
- **`check_user_status`** responde via callback/ack: `{ userId: string, status: 'online' | 'offline' }`

### Cambios en UI

- `lastSeen` eliminado de web (`chat/index.tsx`) y mobile (`chat/[chatId].tsx`)
- `formatLastSeen` y `formatRelativeTime` eliminados (ya no se usan)
- Estado simplificado a: `isOnline ? 'En línea' : 'Desconectado'`

### Nota sobre colección `presence` en Firestore

Los documentos en `presence/{userId}` que escribió la implementación anterior ya no se actualizan.  
No es necesario borrarlos manualmente; simplemente quedan obsoletos y no afectan el funcionamiento.

### Nota sobre mobile (useChatSocket)

Mobile no tenía socket al chat-service (3004). Se creó `useChatSocket.ts` como singleton,  
usando `EXPO_PUBLIC_CHAT_URL` o derivando el puerto 3004 desde `EXPO_PUBLIC_BACKEND_URL`.
