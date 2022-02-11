import { useMemo } from 'react';

export const useLoginValidationRules = () =>
  useMemo(
    () => ({
      email: {
        required: {
          value: true,
          message: 'Email is required',
        },
        pattern: {
          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: 'Must be a valid email',
        },
      },
      password: {
        required: {
          value: true,
          message: 'Password is required',
        },
        pattern: {
          value: /^[a-zA-Z0-9]{10}$/,
          message: 'Must be a valid password',
        },
      },
    }),
    [],
  );
