import { useEffect } from 'react';
import { request } from '../util/request';

export interface IUseMealCaloriesParams {
  isOpen: boolean;
  shouldUpdate: boolean;
  value: string | undefined;
  updateCalories: (value: number) => void;
  setIsCaloriesUpdating: (value: boolean) => void;
}

export const useMealCalories = ({
  setIsCaloriesUpdating,
  updateCalories,
  shouldUpdate,
  isOpen,
  value,
}: IUseMealCaloriesParams) => {
  useEffect(() => {
    if (!isOpen && value && shouldUpdate) {
      setIsCaloriesUpdating(true);

      request({
        url: '/natural/nutrients',
        isTrackApi: true,
        method: 'POST',
        data: {
          query: value,
        },
      })
        .then(data => {
          const calories = data?.foods?.[0]?.nf_calories;

          if (calories) {
            updateCalories(calories);
          }
        })
        .finally(() => setIsCaloriesUpdating(false));
    }
  }, [isOpen, value, setIsCaloriesUpdating, updateCalories, shouldUpdate]);
};
