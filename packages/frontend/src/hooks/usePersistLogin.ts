import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { AuthContext } from '../store/AuthProvider';
import { request } from '../util/request';

export const usePersistLogin = () => {
  const { login } = useContext(AuthContext);

  const { mutate: persistLogin, isLoading } = useMutation(async () => {
    try {
      const { limit, ...user } = await request({ url: '/whoami' });

      login?.(user, limit);
    } catch {}
  });

  useEffect(() => {
    persistLogin();
  }, [persistLogin]);

  return {
    isLoading,
  };
};
