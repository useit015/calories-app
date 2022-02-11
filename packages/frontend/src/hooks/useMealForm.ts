import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAddMealValidationRules } from './useAddMealValidationRules'

export interface IMealForm {
  content: string;
  calories: number | string;
  date: Date | string;
}

export const formatMeal = ({
  date,
  content,
  calories,
}: IMealForm): IMealForm => ({
  content,
  calories: +calories,
  date: new Date(date).toISOString(),
});

export const useMealForm = () => {
  const [isCaloriesUpdating, setIsCaloriesUpdating] = useState<boolean>(false);

  const form = useForm<IMealForm>();

  const rules = useAddMealValidationRules();

  const updateCalories = useCallback(
    (calories: number): void =>
      form.setValue('calories', calories, {
        shouldValidate: true,
      }),
    [form],
  );

  return {
    ...form,
    updateCalories,
    isCaloriesUpdating,
    setIsCaloriesUpdating,
    rules,
  };
};
