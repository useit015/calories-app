import { useCallback, useState } from 'react';

export const useDialog = (onClose?: () => void) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = useCallback((): void => setIsOpen(true), []);

  const handleClose = useCallback((): void => {
    setIsOpen(false);

    onClose?.();
  }, [onClose]);

  return {
    handleClose,
    handleOpen,
    isOpen,
  };
};
