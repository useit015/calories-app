import { UseFormHandleSubmit } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { request } from '../util/request';
import { formatMeal, IMealForm } from './useMealForm';
import { IOpenToastParams } from './useToast';

interface IUseUpdateMealParams {
  mealId: string;
  reset: () => void;
  handleClose: () => void;
  onUpdateMeal: (t: IOpenToastParams) => void;
  handleSubmit: UseFormHandleSubmit<IMealForm>;
}

export const useUpdateMeal = ({
  reset,
  mealId,
  handleClose,
  onUpdateMeal,
  handleSubmit,
}: IUseUpdateMealParams) => {
  const queryClient = useQueryClient();

  return useMutation(
    handleSubmit(async updatedMeal => {
      const result = await request({
        data: formatMeal(updatedMeal),
        url: `/meal/${mealId}`,
        method: 'PATCH',
      });

      reset();

      handleClose();

      queryClient.invalidateQueries('meals');

      onUpdateMeal({
        message: 'Meal updated successfully',
      });

      return result;
    }),
    {
      onError: (error: any) => {
        onUpdateMeal({
          status: 'error',
          message:
            error?.response?.data?.message ??
            'Something went wrong, please try again later',
        });
      },
    },
  );
};
