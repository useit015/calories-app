import axios from 'axios';
import { useQuery } from 'react-query';
import { mealPeriods } from '../enum/mealPeriods';
import { request } from '../util/request';

export interface IStatItem {
  average: number;
  total: number;
  users: Record<
    string,
    {
      calories: number;
      meals: number;
    }
  >;
}

export const useUserMeals = (period: mealPeriods) => {
  const token = localStorage.getItem('token');

  return useQuery(
    ['meals', period],
    () =>
      request({
        url: `/meal?period=${period}`,
      }),
    {
      enabled: !!token,
    },
  );
};
