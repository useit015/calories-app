import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { FC, ReactNode, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import {
  IInviteFriendForm,
  useInviteFriend,
} from '../../hooks/useInviteFriend';
import { useInviteFriendValidationRules } from '../../hooks/useInviteFriendValidationRules';
import { IOpenToastParams } from '../../hooks/useToast';
import { SlideUpTransition } from '../atoms';

interface IInviteFriendProps {
  isOpen: boolean;
  close: () => void;
  className?: string;
  children?: ReactNode;
  onInviteFriend: (t: IOpenToastParams) => void;
}

const InviteFriend: FC<IInviteFriendProps> = ({
  onInviteFriend,
  className,
  isOpen,
  close,
}) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IInviteFriendForm>();

  const rules = useInviteFriendValidationRules();

  const handleClose = useCallback(
    (isLoading?: boolean) => {
      if (!isLoading) {
        reset();

        close();
      }
    },
    [close, reset],
  );

  const { mutate, isLoading } = useInviteFriend({
    onInviteFriend,
    handleSubmit,
    handleClose,
  });

  return (
    <Dialog
      open={isOpen}
      className={className}
      onClose={() => handleClose(isLoading)}
      TransitionComponent={SlideUpTransition}
    >
      <DialogContent className="inner">
        <Controller
          name="name"
          defaultValue=""
          control={control}
          rules={rules.name}
          render={({ field }) => (
            <TextField
              {...field}
              autoFocus
              fullWidth
              label="Name"
              className="input"
              error={!!errors.name}
              helperText={errors.name?.message ?? ' '}
            />
          )}
        />

        <Controller
          name="email"
          defaultValue=""
          control={control}
          rules={rules.email}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              className="input"
              error={!!errors.email}
              helperText={errors.email?.message ?? ' '}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <LoadingButton
          fullWidth
          onClick={mutate}
          loading={isLoading}
          variant="contained"
          className="button"
          size="large"
        >
          Send invitation
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const StyledInviteFriend = styled(InviteFriend)`
  .MuiDialog-paper {
    border-radius: 1rem;
    padding: 1rem;

    .inner {
      padding: 0.5rem;
      padding-top: 1rem;

      .input {
        margin-bottom: 0.5rem;

        .MuiInputBase-root {
          border-radius: 0.75rem !important;
        }
      }
    }

    .button {
      margin: 0 0 0.25rem;
      border-radius: 0.75rem;
      min-height: 2.75rem;
    }
  }
`;

export default StyledInviteFriend;
