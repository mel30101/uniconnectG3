export interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[TokenUtils] Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;
  
  const now = Date.now() / 1000;
  return payload.exp < now;
};

export const getTokenExpirationDate = (token: string): Date | null => {
  const payload = decodeToken(token);
  if (!payload) return null;
  
  return new Date(payload.exp * 1000);
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  return !isTokenExpired(token);
};
