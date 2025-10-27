'use client';

import { useState, useCallback } from 'react';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: 'warning' | 'info' | 'danger' | 'success';
  onConfirm?: () => void;
}

export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const showConfirm = useCallback(
    (options: Omit<ConfirmDialogState, 'isOpen'>) => {
      return new Promise<boolean>((resolve) => {
        setDialogState({
          ...options,
          isOpen: true,
          onConfirm: () => {
            resolve(true);
            setDialogState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      });
    },
    []
  );

  const handleCancel = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
  }, [dialogState]);

  return {
    dialogState,
    showConfirm,
    handleCancel,
    handleConfirm,
  };
}
