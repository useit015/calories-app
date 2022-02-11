import { authActionTypes } from '../enum/authActionTypes';
import { IUser } from '../reducers/authReducer';

export const loginAction = (user: IUser, limit: number) => ({
  type: authActionTypes.LOGIN,
  payload: {
    limit,
    user,
  },
});

export const logoutAction = () => ({
  type: authActionTypes.LOGOUT,
});
