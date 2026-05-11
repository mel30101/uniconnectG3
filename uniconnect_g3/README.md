# UniConnect - App Frontend (Mobile)

**UniConnect** es una plataforma móvil diseñada para fomentar la conectividad académica entre estudiantes. Permite la búsqueda de compañeros por materias, la identificación de monitores académicos y la visualización de perfiles detallados.

## Tecnologías Principales

* **Framework:** [React Native](https://reactnative.dev/) con **Expo** (SDK 50+).
* **Navegación:** [Expo Router](https://docs.expo.dev/router/introduction/) (Basado en archivos).
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/).
* **Estado Global:** React Context API (AuthContext).
* **Iconografía:** Ionicons (@expo/vector-icons).

---

## Estructura del proyecto
app/
├── (tabs)/             # Navegación principal por pestañas (Inicio, Perfil, Buscar)
├── context/            # Proveedores de estado global (AuthContext)
├── user/               # Rutas dinámicas (Perfil externo [id].tsx)
├── services/           # Llamadas a la API (userService.js)
├── components/         # Componentes reutilizables (UserCard, etc.)
└── _layout.tsx         # Configuración de rutas y Providers

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
* **Node.js** (v18 o superior).
* **npm** o **yarn**.
* **Expo Go** en tu dispositivo móvil o un emulador de Android/iOS configurado.

---

## Instalación y Configuración

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/mel30101/uniconnect_g3.git]
   cd uniconnect-frontend

2. **Instalar dependencias**
    npm install

3. **Variables de entorno**
    Crea un archivo .env en la raíz del proyecto y añade la URL de tu backend:
    EXPO_PUBLIC_BACKEND_URL=http://tu-ip-local:3000

4. **Iniciar proyecto**
    npx expo start
