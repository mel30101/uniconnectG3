import { useNavigate, useParams } from 'react-router-dom';
import type { AppNavigation } from '@uniconnect/shared/navigation';

export function useAppNavigation(): AppNavigation {
  const navigate = useNavigate();
  const params = useParams() as Record<string, string>;

  return {
    push(path, queryParams) {
      const search = queryParams
        ? '?' + new URLSearchParams(queryParams as Record<string, string>).toString()
        : '';
      navigate(path + search);
    },
    replace(path) {
      navigate(path, { replace: true });
    },
    back() {
      navigate(-1);
    },
    params,
  };
}
