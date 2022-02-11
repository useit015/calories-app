import { useMemo } from 'react';

export const useAddMealValidationRules = () =>
  useMemo(
    () => ({
      content: {
        required: {
          value: true,
          message: 'Content is required',
        },
        minLength: {
          value: 3,
          message: 'Content must be at least 3 characters long',
        },
      },
      calories: {
        required: {
          value: true,
          message: 'Calories is required',
        },
        min: {
          value: 0,
          message: 'Calories must be greater than 0',
        },
      },
      date: {
        required: {
          value: true,
          message: 'Date is required',
        },
      },
    }),
    [],
  );
