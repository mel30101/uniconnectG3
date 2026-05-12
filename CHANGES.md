# CHANGES

## [FIX] Presencia — _layout mobile y chatConnected reactivo web

**Fecha:** 2026-05-12

### Bug Mobile: "Invalid hook call" en _layout.tsx
**Síntoma:** Crash al iniciar la app con error "Cannot read property 'useCallback' of null" apuntando a `RootLayout(./_layout.tsx)`.

**Causa:** El componente `RootLayout` exportado directamente llamaba hooks de Zustand (`authStore((state) => state.user)`) en un contexto donde React aún no estaba completamente inicializado. Expo Router puede ejecutar el componente raíz antes de que el árbol de React esté listo.

**Fix:** Envolver todo el contenido de `RootLayout` en un componente hijo `RootLayoutInner`. El componente raíz exportado ahora solo renderiza `<RootLayoutInner />`, garantizando que React esté completamente inicializado antes de ejecutar los hooks.

### Bug Web: presencia no actualiza en tiempo real
**Síntoma:** Cuando un usuario se conecta, el indicador de presencia no cambia a "En línea" hasta recargar la página o cambiar de chat.

**Causa:** `SocketContext` exponía `chatSocket` como estado, pero la referencia del objeto socket no cambia cuando conecta/desconecta — solo cambia su estado interno `.connected`. El `useEffect` en `usePresence` con dependencia `[chatSocket]` no se re-ejecutaba porque React no detectaba cambio en la referencia.

**Fix:** 
- `SocketContext` ahora expone `chatConnected` (boolean) como estado reactivo separado
- Se actualiza en los eventos `connect`/`disconnect` del socket
- `usePresence` usa `chatConnected` como dependencia en lugar de `socketConnected` local
- Nuevo hook `useChatConnected()` exportado desde `SocketContext`

**Archivos modificados:**
- `uniconnect_g3/app/_layout.tsx` - Componente raíz envuelto en hijo
- `uniconnect_web/src/context/SocketContext.tsx` - Estado `chatConnected` reactivo
- `uniconnect_web/src/hooks/usePresence.ts` - Usa `chatConnected` del contexto

---

## [FIX] Presencia — actualización en tiempo real y crash mobile

**Fecha:** 2026-05-12

### Bug 1 (Web): presencia no actualizaba sin recargar
**Síntoma:** Cuando un usuario que estaba desconectado se conecta, el indicador no cambia a "En línea" — solo se actualiza si cambias de chat o recargas la página.

**Causa:** El `useEffect` en `useOtherPresence` tiene el socket como dependencia, pero el socket es una referencia estable que no cambia. Cuando el socket es `null` al montar (porque aún se está conectando), el `useEffect` sale por el guard `if (!chatSocket) return` y **nunca se vuelve a ejecutar** para registrar el listener cuando el socket ya está listo.

**Fix:** Estado `socketConnected` como dependencia del `useEffect` para forzar re-ejecución cuando el socket conecta. Se escuchan los eventos `connect`/`disconnect` del socket para actualizar este estado.

### Bug 2 (Mobile): crash "Invalid hook call" en _layout.tsx
**Síntoma:** Crash con error "Cannot read property 'useCallback' of null" al iniciar la app.

**Causa:** `useChatSocket` llamaba `authStore((state) => state.user)` dentro del `useEffect` — esto es un **hook de React** (Zustand hook) que no puede llamarse desde un singleton de módulo. Viola las reglas de hooks y causa el crash.

**Fix:** Reemplazado por `authStore.getState().user` (API imperativa de Zustand, NO un hook). Esta API es válida en cualquier contexto, no solo en componentes React.

**Archivos modificados:**
- `uniconnect_web/src/hooks/usePresence.ts` - Estado `socketConnected` como dependencia
- `uniconnect_g3/src/presentation/hooks/usePresence.ts` - Estado `socketConnected` como dependencia
- `uniconnect_g3/src/presentation/hooks/useChatSocket.ts` - `authStore()` → `authStore.getState()`

---

## [FIX] Presencia — estado no se actualiza en tiempo real en chat 1-a-1

**Fecha:** 2026-05-11

**Causa encontrada:** El backend emite `USER_STATUS_CHANGED` **solo a los rooms de grupos compartidos** (`io.to(gid).emit(...)`). En un chat 1-a-1, el usuario A no está en ningún room de grupo con B, así que el evento nunca llega al listener del frontend. El fallback `io.emit(...)` (broadcast global) solo ocurre si `getGroupsByUserId` lanza una excepción, no en condiciones normales.

**Fix aplicado:** Polling cada 5 segundos con `check_user_status` (callback/ack) mientras el chat está abierto. El listener `USER_STATUS_CHANGED` se mantiene como complemento para el caso en que el backend haga fallback broadcast.

**Archivos modificados:**
- `uniconnect_web/src/hooks/usePresence.ts`
- `uniconnect_g3/src/presentation/hooks/usePresence.ts`

**Nota:** La solución ideal sería que el backend emitiera `USER_STATUS_CHANGED` también al room `user_${userId}` (que ya existe), pero eso requiere modificar el backend. El polling de 5s es un workaround funcional con impacto mínimo (una consulta ligera por socket cada 5s solo mientras el chat está visible).

---



## [FIX] Presencia — "Desconectado" aunque usuario está activo

**Fecha:** 2026-05-11

**Causa encontrada:** Causa C + Causa A combinadas.
- **Causa C**: `SocketContext.tsx` usaba `useRef` para almacenar los sockets. El `Provider` renderizaba con `null` (valor inicial del ref), luego el `useEffect` creaba el socket y asignaba `ref.current`, pero sin causar re-render. Los consumidores de `useChatSocket()` nunca recibían el socket real, el `useEffect` de `useOtherPresence` salía por el guard `if (!chatSocket)` y nunca volvía a correr.
- **Causa A**: incluso con el socket disponible, `check_user_status` podía emitirse antes de que el socket terminara de conectar, perdiendo el callback.

**Fix aplicado:**
- `SocketContext.tsx`: `useRef` → `useState`. El socket se expone al estado solo en el evento `'connect'`, forzando re-render de todos los consumidores.
- `usePresence.ts` (web y mobile): `queryStatus` se ejecuta inmediatamente si `socket.connected`, o espera `once('connect')` si no.
- `useChatSocket.ts` (mobile): refactorizado con patrón pub/sub (`Set` de listeners) para notificar a todos los componentes que usan el hook cuando el socket singleton conecta/desconecta.

**Archivos modificados:**
- `uniconnect_web/src/context/SocketContext.tsx`
- `uniconnect_web/src/hooks/usePresence.ts`
- `uniconnect_g3/src/presentation/hooks/useChatSocket.ts`
- `uniconnect_g3/src/presentation/hooks/usePresence.ts`

---



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
