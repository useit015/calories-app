import { useMemo } from 'react';

export const useInviteFriendValidationRules = () =>
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
      name: {
        required: {
          value: true,
          message: 'Name is required',
        },
      },
    }),
    [],
  );
