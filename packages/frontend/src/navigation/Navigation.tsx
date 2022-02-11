import { CircularProgress } from '@mui/material';
import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { usePersistLogin } from '../hooks/usePersistLogin';
import { Authorizer } from './Authorizer';
import { IRoute } from './routes';

interface INavigationProps {
  routes: IRoute[];
}

const Navigation: FC<INavigationProps> = ({ routes }) => {
  const { isLoading } = usePersistLogin();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ isAuth, Component, path }) => (
          <Route
            key={path}
            path={path}
            element={
              !!isAuth ? (
                <Authorizer>
                  <Component />
                </Authorizer>
              ) : (
                <Component />
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
