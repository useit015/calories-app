import { FC, ReactNode, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Roles } from '../enum/roles';
import { AuthContext } from '../store/AuthProvider';

interface IAuthorizerProps {
  children: ReactNode;
  role?: Roles;
}

export const Authorizer: FC<IAuthorizerProps> = ({ children, role }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const from = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate replace to="/login" state={{ from }} />;
  } else if (role && user.role !== role) {
    return <Navigate replace to="/meals" state={{ from }} />;
  }

  return <>{children}</>;
};
