import { useCallback } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { useMutation } from 'react-query';
import { request } from '../util/request';
import { IOpenToastParams } from './useToast';

export interface IInviteFriendForm {
  email: string;
  name: string;
}

interface IUseInviteFriendParams {
  handleClose: () => void;
  onInviteFriend: (t: IOpenToastParams) => void;
  handleSubmit: UseFormHandleSubmit<IInviteFriendForm>;
}

export const useInviteFriend = ({
  onInviteFriend,
  handleSubmit,
  handleClose,
}: IUseInviteFriendParams) => {
  const inviteFriend = useCallback(
    async ({ name, email }: IInviteFriendForm) => {
      const data = await request({
        method: 'POST',
        url: '/invite',
        data: {
          name,
          email,
        },
      });

      onInviteFriend({
        message: `${name} has been invited to join the calories app`,
      });

      handleClose();

      return data;
    },
    [onInviteFriend, handleClose],
  );

  const onError = useCallback(
    error => {
      onInviteFriend({
        status: 'error',
        message:
          error?.response?.data?.message ??
          'Something went wrong, please try again later',
      });
    },
    [onInviteFriend],
  );

  return useMutation(handleSubmit(inviteFriend), {
    onError,
  });
};
