import { FC, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthProvider';

const Redirect: FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return <Navigate to={isAuthenticated && user ? '/meals' : '/login'} />;
};

export default Redirect;
