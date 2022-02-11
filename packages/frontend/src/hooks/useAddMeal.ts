import { useCallback } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { request } from '../util/request';
import { formatMeal, IMealForm } from './useMealForm';
import { IOpenToastParams } from './useToast';

interface IUseAddMealParams {
  reset: () => void;
  handleClose: () => void;
  onAddMeal: (t: IOpenToastParams) => void;
  handleSubmit: UseFormHandleSubmit<IMealForm>;
}

export const useAddMeal = ({
  handleSubmit,
  handleClose,
  onAddMeal,
  reset,
}: IUseAddMealParams) => {
  const queryClient = useQueryClient();

  const addMeal = useCallback(
    async meal => {
      const newMeal = await request({
        data: formatMeal(meal),
        method: 'POST',
        url: '/meal',
      });

      queryClient.invalidateQueries('meals');

      onAddMeal({ message: 'Meal added successfully' });

      handleClose();

      reset();

      return newMeal;
    },
    [queryClient, handleClose, onAddMeal, reset],
  );

  return useMutation(handleSubmit(addMeal));
};
