import { useCallback, useContext } from 'react';
import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetError,
} from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthProvider';
import { request } from '../util/request';

export interface IFormInput {
  email: string;
  password: string;
}

export const useLogin = (
  handleSubmit: UseFormHandleSubmit<IFormInput>,
  setError: UseFormSetError<IFormInput>,
) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const signIn = useCallback<SubmitHandler<IFormInput>>(
    async ({ email, password }) => {
      const { token, limit, ...user } = await request({
        url: '/login',
        method: 'POST',
        data: {
          username: email,
          password,
        },
      });

      navigate('/meals');

      login?.(user, limit, token);
    },
    [login, navigate],
  );

  const onError = useCallback(() => {
    setError('email', {}, { shouldFocus: true });

    setError('password', {
      message: 'Email or password is incorrect',
    });
  }, [setError]);

  return useMutation(handleSubmit(signIn), {
    onError,
  });
};
