import { FC } from 'react';
import { Roles } from '../enum/roles';
import { Redirect, Login, UserMeals } from '../pages';

export interface IRoute {
  isAuth?: boolean;
  Component: FC;
  path: string;
  role?: Roles;
}

export const routes: IRoute[] = [
  {
    path: '/',
    isAuth: true,
    Component: Redirect,
  },
  {
    isAuth: true,
    path: '/meals',
    Component: UserMeals,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '*',
    Component: Redirect,
  },
];
