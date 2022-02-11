import { useCallback, useEffect, useState } from 'react';
import { request } from '../util/request';
import { IUseMealCaloriesParams, useMealCalories } from './useMealCalories';

export interface IAutocompleteOption {
  id: number;
  text: string;
}

export const useAutocomplete = (
  params: Omit<IUseMealCaloriesParams, 'isOpen'>,
) => {
  const [isOpen, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [options, setOptions] = useState<IAutocompleteOption[]>([]);

  const onClose = useCallback(() => setOpen(false), []);

  useMealCalories({
    ...params,
    isOpen,
  });

  const updateOptions = useCallback(async (value: string) => {
    if (value) {
      try {
        setIsLoading(true);

        const data = await request({
          url: `/autocomplete?q=${value}`,
          isNutritionix: true,
        });

        setOptions(data);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const onOpen = useCallback<(e: any) => void>(
    ({ target }) => {
      setOpen(true);

      if (target?.value) {
        updateOptions(target.value);
      }
    },
    [updateOptions],
  );

  useEffect(() => {
    if (!isOpen) {
      setOptions([]);
    }
  }, [isOpen]);

  return {
    onClose,
    onOpen,
    isOpen,
    options,
    isLoading,
    updateOptions,
  };
};
