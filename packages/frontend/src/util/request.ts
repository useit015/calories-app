import axios, { AxiosRequestConfig, Method } from 'axios';

interface IRequestParams extends AxiosRequestConfig {
  isTrackApi?: boolean;
  isNutritionix?: boolean;
}

export const request = async <T = any>({
  isNutritionix,
  isTrackApi,
  ...config
}: IRequestParams): Promise<T> => {
  const { data } = await axios.request<T>({
    ...config,
    baseURL:
      process.env[
        `REACT_APP_${
          isNutritionix ? 'NUTRITIONIX' : isTrackApi ? 'TRACKAPI' : 'API'
        }_URL`
      ],
    headers:
      isNutritionix || isTrackApi
        ? {
            'x-app-id': process.env.REACT_APP_NUTRITIONIX_ID as string,
            'x-app-key': process.env.REACT_APP_NUTRITIONIX_KEY as string,
          }
        : {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
  });

  return data;
};
