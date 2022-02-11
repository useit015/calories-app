import { authActionTypes } from '../enum/authActionTypes';
import { Roles } from '../enum/roles';

export interface ReducerAction {
  type: string;
  payload?: any;
}

export interface IUser {
  name: string;
  email: string;
  role: Roles;
  id: string;
}

export interface IAuthState {
  isAuthenticated: boolean;
  dailyLimit: number;
  user: IUser | null;
}

export const initialState: IAuthState = {
  isAuthenticated: false,
  dailyLimit: 2100,
  user: null,
};

const login = (
  state: IAuthState,
  user: IUser,
  dailyLimit: number,
): IAuthState => ({
  ...state,
  isAuthenticated: true,
  dailyLimit,
  user,
});

export const reducer = (
  state = initialState,
  { type, payload }: ReducerAction,
) => {
  switch (type) {
    case authActionTypes.LOGIN:
      return login(state, payload.user, payload.limit);
    case authActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
