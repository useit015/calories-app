import { useState } from 'react';

interface IMealActionsState {
  mealToUpdate: any;
  mealToDelete: any;
}

const initialState: IMealActionsState = {
  mealToUpdate: null,
  mealToDelete: null,
};

export const useMealActions = () => {
  const [mealActionsState, setMealActionsState] =
    useState<IMealActionsState>(initialState);

  const closeDeleteMeal = () => setMealActionsState(initialState);

  const closeUpdateMeal = () => setMealActionsState(initialState);

  const updateMeal = (meal: any) =>
    setMealActionsState({
      mealToDelete: null,
      mealToUpdate: {
        ...meal,
      },
    });

  const deleteMeal = (meal: any) =>
    setMealActionsState({
      mealToUpdate: null,
      mealToDelete: {
        ...meal,
      },
    });

  return {
    ...mealActionsState,
    closeDeleteMeal,
    closeUpdateMeal,
    updateMeal,
    deleteMeal,
  };
};
