/**
 * Interfaz común de navegación cross-platform.
 * Las implementaciones concretas viven en cada app:
 *   - uniconnect_g3: useAppNavigation.native.ts (expo-router)
 *   - uniconnect_web: useAppNavigation.web.ts (react-router-dom)
 */
export interface AppNavigation {
  push(path: string, params?: Record<string, unknown>): void;
  replace(path: string): void;
  back(): void;
  params: Record<string, string>;
}

export type UseAppNavigation = () => AppNavigation;
