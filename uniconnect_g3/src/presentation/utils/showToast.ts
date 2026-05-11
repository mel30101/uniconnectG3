import { Alert, Platform } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastFn = (opts: { type?: ToastType; title?: string; message: string; data?: any }) => void;

let registeredToast: ToastFn | null = null;

/**
 * Permite a un componente (NotificationProvider) registrar un toast handler global.
 * Llamado una vez en el árbol root.
 */
export const registerToastHandler = (fn: ToastFn) => {
  registeredToast = fn;
};

/**
 * Helper cross-platform.
 *  - Web: usa el handler registrado (NotificationContext) si existe.
 *  - Mobile (o fallback): usa Alert.alert.
 */
export const showToast = (
  message: string,
  type: ToastType = 'info',
  title?: string,
  data?: any
) => {
  // Siempre guardar la notificación en el store de notificaciones (si existe el handler)
  if (registeredToast) {
    registeredToast({ type, title, message, data });
  }

  // Si estamos en Web, el toast visual ya lo maneja NotificationStack
  if (Platform.OS === 'web') {
    return;
  }
  
  // En Mobile, mostramos el Alert visualmente (ya que no hay toasts de pantalla completa nativos)
  Alert.alert(title || tituloPorTipo(type), message);
};

const tituloPorTipo = (type: ToastType) => {
  switch (type) {
    case 'success': return 'Éxito';
    case 'error': return 'Error';
    case 'warning': return 'Atención';
    default: return 'Aviso';
  }
};
