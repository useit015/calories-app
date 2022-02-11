import { createContext, FC, ReactNode, useMemo, useReducer } from 'react';
import { useQueryClient } from 'react-query';
import { loginAction, logoutAction } from '../actions/authActions';
import { Roles } from '../enum/roles';
import {
  IAuthState,
  initialState,
  IUser,
  reducer,
} from '../reducers/authReducer';

interface IAuthProps {
  children: ReactNode;
}

export interface IAuthActions {
  login?: (user: IUser, limit: number, token?: string) => void;
  logout?: () => void;
}

export const AuthContext = createContext<
  IAuthState & IAuthActions & { isAdmin?: boolean }
>(initialState);

export const AuthProvider: FC<IAuthProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const [authState, dispatch] = useReducer(reducer, initialState);

  const isAdmin = useMemo(
    () => authState.user?.role === Roles.ADMIN,
    [authState],
  );

  const login = (user: IUser, limit: number, token?: string): void => {
    if (token) {
      localStorage.setItem('token', token);
    }

    dispatch(loginAction(user, limit));
  };

  const logout = (): void => {
    localStorage.removeItem('token');

    queryClient.invalidateQueries();

    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isAdmin,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
