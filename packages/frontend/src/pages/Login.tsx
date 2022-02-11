import Container from '@mui/material/Container';
import { FC, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { LoginForm } from '../components/organisms';
import { AuthContext } from '../store/AuthProvider';

interface ILoginProps {
  className: string;
}

const Login: FC<ILoginProps> = ({ className }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && user) {
    return <Navigate to="/meals" />;
  }

  return (
    <Container maxWidth="xs" className={className}>
      <LoginForm />
    </Container>
  );
};

const StyledLogin = styled(Login)``;

export default StyledLogin;
