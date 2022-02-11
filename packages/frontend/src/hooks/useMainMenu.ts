import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { AuthContext } from '../store/AuthProvider';

interface IMenuState {
  isAddMealOpen: boolean;
  isInviteFriendOpen: boolean;
}

export interface IMenuAction {
  action?: () => void;
  Icon: FC<any>;
  name: string;
  id: string;
}

export const useMainMenu = () => {
  const { isAdmin, logout } = useContext(AuthContext);

  const [menuState, setMenuState] = useState<IMenuState>({
    isAddMealOpen: false,
    isInviteFriendOpen: false,
  });

  const menuActions = useMemo<IMenuAction[]>(() => {
    const actions = [
      {
        id: 'logout',
        name: 'Logout',
        action: logout,
        Icon: LogoutIcon,
      },
      {
        id: 'inviteFriend',
        Icon: PersonAddIcon,
        name: 'Invite Friend',
        action: () =>
          setMenuState(s => ({
            ...s,
            isInviteFriendOpen: true,
          })),
      },
    ];

    if (!isAdmin) {
      actions.push({
        id: 'addMeal',
        Icon: RestaurantMenuIcon,
        name: 'Add Meal',
        action: () =>
          setMenuState(s => ({
            ...s,
            isAddMealOpen: true,
          })),
      });
    }

    return actions;
  }, [logout, isAdmin]);

  const closeAddMeal = useCallback(
    (): void =>
      setMenuState(s => ({
        ...s,
        isAddMealOpen: false,
      })),
    [],
  );

  const closeInviteFriend = useCallback(
    (): void =>
      setMenuState(s => ({
        ...s,
        isInviteFriendOpen: false,
      })),
    [],
  );

  return {
    ...menuState,
    closeInviteFriend,
    closeAddMeal,
    menuActions,
  };
};
