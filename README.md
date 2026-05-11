# UniConnect - Ecosistema Multiplataforma

> Plataforma universitaria de conexión social con arquitectura monorepo compartida

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.1-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff)](https://vitejs.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020)](https://expo.dev/)

---

## 📁 Estructura del Monorepo

```
uniconnect/
├── packages/
│   └── shared/                    # 🎯 Fuente Única de Verdad
│       ├── src/
│       │   ├── api/              # 8 clientes de API (Auth, User, Group, Chat, etc.)
│       │   ├── types/            # 12 entidades unificadas (User, Group, Event, etc.)
│       │   ├── stores/           # Zustand stores (authStore, etc.)
│       │   ├── validators/       # Zod schemas
│       │   └── utils/            # Utilidades compartidas
│       └── package.json
│
├── uniconnect_web/               # 🌐 Aplicación Web (Vite + React)
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── pages/               # Páginas con React Router
│   │   ├── adapters/            # Storage adapter (localStorage)
│   │   └── main.tsx
│   └── package.json
│
├── uniconnect_g3/                # 📱 Aplicación Móvil (Expo + React Native)
│   ├── app/                     # Expo Router (file-based routing)
│   ├── src/
│   │   ├── presentation/        # UI components & hooks
│   │   ├── domain/              # Entities & repositories (interfaces)
│   │   ├── data/                # Repository implementations
│   │   └── di/                  # Dependency injection
│   ├── adapters/                # Storage adapter (AsyncStorage)
│   └── package.json
│
├── uniconnect_g3_backend/        # 🔧 Backend (Node.js + Express)
│   └── uniconnect-backend/
│       ├── gateway/             # API Gateway (puerto 3000)
│       └── services/            # Microservicios (3001-3006)
│
├── pnpm-workspace.yaml          # Configuración del workspace
└── package.json                 # Scripts unificados
```

---

## 🚀 Quick Start

### Prerrequisitos

- **Node.js** 18+
- **pnpm** 8+
- **Expo CLI** (para móvil)
- **Firebase** account (para backend)

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd uniconnect

# Instalar dependencias (todas las workspaces)
pnpm install

# Compilar el paquete shared
cd packages/shared
pnpm build
```

### Desarrollo

```bash
# 🌐 Iniciar aplicación Web
pnpm dev:web
# → http://localhost:5173

# 📱 Iniciar aplicación Móvil
pnpm dev:mobile
# → Expo DevTools en http://localhost:8081

# 🔧 Iniciar Backend (TODOS los servicios)
cd uniconnect_g3_backend/uniconnect-backend
npm run dev
# → Gateway (3000) + 6 microservicios (3001-3006)
```

**Nota importante**: El backend requiere que **todos los servicios** estén corriendo. Ver [BACKEND_STARTUP.md](./uniconnect_g3_backend/BACKEND_STARTUP.md) para instrucciones detalladas.

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev:web              # Vite dev server (Web)
pnpm dev:mobile           # Expo start (Mobile)
pnpm dev:shared           # TypeScript watch mode (Shared)

# Build
pnpm build:web            # Build producción Web
pnpm build:mobile         # Build producción Mobile (EAS)
pnpm build:shared         # Compilar TypeScript (Shared)

# Linting & Testing
pnpm lint                 # ESLint en todos los workspaces
pnpm type-check           # TypeScript check
```

---

## 🛠️ Tech Stack

### Frontend Web
- **Framework:** React 19.1
- **Bundler:** Vite 8.0
- **Routing:** React Router 7.x
- **Styling:** Tailwind CSS 3.x
- **State:** Zustand 5.x (desde `@uniconnect/shared`)
- **HTTP Client:** Axios (desde `@uniconnect/shared`)
- **Icons:** Lucide React

### Frontend Mobile
- **Framework:** React Native 0.81
- **Platform:** Expo 54
- **Routing:** Expo Router 6.x (file-based)
- **Styling:** React Native StyleSheet
- **State:** Zustand 5.x (desde `@uniconnect/shared`)
- **HTTP Client:** Axios (desde `@uniconnect/shared`)
- **Icons:** Lucide React Native

### Shared Package (`@uniconnect/shared`)
- **Language:** TypeScript 5.9
- **State Management:** Zustand 5.x
- **HTTP Client:** Axios 1.13
- **Validation:** Zod 3.23
- **Real-time:** Socket.IO Client 4.8
- **Date Utils:** date-fns 4.1
- **Backend SDK:** Firebase 12.9

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 5.x
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth + JWT
- **Real-time:** Socket.IO 4.x
- **Gateway:** http-proxy-middleware

---

## 📦 Paquete Shared (`@uniconnect/shared`)

### ¿Qué es?

El paquete `@uniconnect/shared` es la **Fuente Única de Verdad** que contiene:
- ✅ 12 entidades unificadas (User, Group, Event, Chat, Message, etc.)
- ✅ 8 clientes de API (Auth, User, Academic, Search, Group, Event, Chat, Notification)
- ✅ Stores de Zustand (authStore, userStore, socialStore, chatStore)
- ✅ Validadores Zod
- ✅ Utilidades compartidas

### Beneficios

- 🎯 **Single Source of Truth:** Un solo lugar para tipos y lógica de negocio
- 🔄 **Sincronización automática:** Cambios en shared se reflejan en Web y Mobile
- 🚀 **Desarrollo más rápido:** No duplicar código entre plataformas
- 🛡️ **Type Safety:** TypeScript garantiza consistencia

### Ejemplo de Uso

```typescript
// En Web o Mobile
import { authStore, UserApi, createApiClient } from '@uniconnect/shared';

// Usar el store
const user = authStore((state) => state.user);
const login = authStore((state) => state.login);

// Usar el API client
const apiClient = createApiClient({
  baseURL: 'http://localhost:3000',
  getAuthToken: async () => authStore.getState().token,
  onUnauthorized: () => authStore.getState().logout(),
});

const userApi = new UserApi(apiClient);
const profile = await userApi.getProfile(userId);
```

---

## 🏗️ Arquitectura

### Clean Architecture (Mobile)

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (UI Components, Hooks, Screens)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Domain Layer                  │
│  (Entities, Repositories Interfaces)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Data Layer                    │
│  (Repository Implementations)           │
└──────────────┬──────────────────────────┘
               │
               ▼
       @uniconnect/shared
       (API Clients, Types)
```

### Shared Package Architecture

```
┌─────────────────────────────────────────┐
│        @uniconnect/shared               │
│  ┌──────────────────────────────────┐   │
│  │  Types (12 entidades)            │   │
│  │  User, Group, Event, Chat...     │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  APIs (8 clientes)               │   │
│  │  Auth, User, Group, Chat...      │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  Stores (Zustand)                │   │
│  │  authStore, userStore...         │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                 ▲
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────┐              ┌─────▼───┐
│  Web   │              │ Mobile  │
└────────┘              └─────────┘
```

---

## 🔐 Autenticación

### Flujo de Auth

1. Usuario hace login → `AuthApi.login()`
2. Backend responde con `{ token, user }`
3. `authStore.setToken(token)` → Actualiza estado compartido
4. Storage adapter guarda token localmente:
   - **Web:** `localStorage.setItem('auth_token', token)`
   - **Mobile:** `AsyncStorage.setItem('@uniconnect:token', token)`

### Sesiones Independientes

- Cada plataforma tiene su propio almacenamiento local
- El logout en una plataforma NO invalida el token en el servidor
- Las sesiones son independientes por dispositivo

---

## 🌐 Variables de Entorno

### Web (`.env` en `uniconnect_web/`)

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
```

### Mobile (`.env` en `uniconnect_g3/`)

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
```

**Nota:** Los prefijos son diferentes (`VITE_` vs `EXPO_PUBLIC_`) porque cada bundler los requiere.

---

## 📊 Métricas del Proyecto

- **Entidades unificadas:** 12
- **APIs en shared:** 8
- **Reducción de bundle móvil:** -52.3 MB (-9.2%)
- **Reducción de bundle JS:** ~25%
- **Dependencias web en móvil:** 0
- **Cobertura de tipos:** 100%

---

## 🤝 Contribución

### Reglas para Agentes de IA

1. **NUNCA** agregar lógica de negocio fuera de `packages/shared`
2. **NUNCA** crear tipos duplicados (usar siempre `@uniconnect/shared`)
3. **SIEMPRE** usar los API clients de shared (no crear instancias de Axios directamente)
4. **SIEMPRE** respetar Clean Architecture en el móvil
5. **SIEMPRE** compilar shared después de cambios (`pnpm build` en `packages/shared`)

### Workflow de Desarrollo

1. Hacer cambios en `packages/shared` si es necesario
2. Compilar shared: `cd packages/shared && pnpm build`
3. Hacer cambios en Web o Mobile
4. Probar en ambas plataformas
5. Commit y push

---

## 📚 Documentación Adicional

- [AGENTS.md](./AGENTS.md) - Guía para agentes de IA
- [Migration Guide](./openspec/changes/web-extraction-setup/migration-guide.md) - Lecciones aprendidas
- [API Documentation](./packages/shared/API.md) - Documentación de APIs
- [Troubleshooting](./openspec/changes/web-extraction-setup/migration-guide.md#troubleshooting) - Errores comunes

---

## 📝 Licencia

[Especificar licencia]

---

## 👥 Equipo

Desarrollado por el equipo de UniConnect

---

**Última actualización:** 2026-05-08  
**Versión:** 2.0.0 (Monorepo Multiplataforma)
