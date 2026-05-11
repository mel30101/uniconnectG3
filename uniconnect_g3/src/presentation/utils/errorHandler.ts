import { Alert } from 'react-native';

export const handleApiError = (e: any, defaultMsg: string = 'Ocurrió un error inesperado.') => {
  const errorMessage = e.response?.data?.message || e.response?.data?.error || e.message;

  let userFriendlyMsg = defaultMsg;

  // Diccionario de traducciones
  const errorTranslations: { [key: string]: string } = {
    'REQUEST_ALREADY_EXISTS': 'Ya tienes una solicitud pendiente para este grupo.',
    'USER_ALREADY_IN_GROUP': 'Ya eres parte de este grupo.',
    'GROUP_NAME_ALREADY_EXISTS': 'El nombre del grupo ya está en uso.',
    'NAME_TOO_SHORT': 'El nombre es demasiado corto (mín. 3 caracteres).',
    'SUBJECT_GROUP_LIMIT_REACHED': 'No es posible crear el grupo. Se ha alcanzado el límite máximo de 3 grupos de estudio para esta asignatura.',
    'NO_PENDING_TRANSFER': 'No hay una transferencia pendiente para este grupo.',
    'CANDIDATE_NOT_A_MEMBER': 'El candidato seleccionado no es miembro del grupo.',
    'NOT_AUTHORIZED': 'No tienes autorización para realizar esta acción.',
  };

  if (errorTranslations[errorMessage]) {
    userFriendlyMsg = errorTranslations[errorMessage];
  }

  Alert.alert('Aviso', String(userFriendlyMsg));
};