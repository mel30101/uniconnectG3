import { useRouter, useLocalSearchParams } from 'expo-router';
import type { AppNavigation } from '@uniconnect/shared/navigation';

export function useAppNavigation(): AppNavigation {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();

  return {
    push(path, queryParams) {
      router.push({ pathname: path as never, params: queryParams as never });
    },
    replace(path) {
      router.replace(path as never);
    },
    back() {
      router.back();
    },
    params,
  };
}
