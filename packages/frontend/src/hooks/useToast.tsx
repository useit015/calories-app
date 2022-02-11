import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';

export interface IOpenToastParams {
  status?: 'success' | 'error';
  message: string;
}

interface IToastState {
  status: 'success' | 'error';
  message: string;
  isOpen: boolean;
}

const initialState: IToastState = {
  status: 'success',
  message: '',
  isOpen: false,
};

export const useToast = () => {
  const [{ status, isOpen, message }, setToastState] =
    useState<IToastState>(initialState);

  const openToast = useCallback(
    ({ message, status = 'success' }: IOpenToastParams): void =>
      setToastState({
        isOpen: true,
        message,
        status,
      }),
    [],
  );

  const handleClose = useCallback(
    (_?: SyntheticEvent | Event, reason?: string): void => {
      if (reason === 'clickaway') {
        return;
      }

      setToastState(state => ({
        ...state,
        isOpen: false,
      }));

      setTimeout(() => setToastState(initialState), 100);
    },
    [],
  );

  const toast = useMemo(
    () => (
      <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          severity={status}
          onClose={handleClose}
          sx={{
            width: '100%',
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    ),
    [isOpen, handleClose, message, status],
  );

  return {
    openToast,
    toast,
  };
};
