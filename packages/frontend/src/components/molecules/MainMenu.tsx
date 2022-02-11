import MenuIcon from '@mui/icons-material/Menu';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { IMenuAction } from '../../hooks/useMainMenu';

interface IMainMenuProps {
  className?: string;
  children?: ReactNode;
  actions: IMenuAction[];
}

const MainMenu: FC<IMainMenuProps> = ({ className, actions }) => {
  return (
    <SpeedDial className={className} ariaLabel="Main menu" icon={<MenuIcon />}>
      {actions.map(({ name, Icon, action }) => (
        <SpeedDialAction
          icon={<Icon color="primary" />}
          tooltipTitle={name}
          onClick={action}
          tooltipOpen
          key={name}
        />
      ))}
    </SpeedDial>
  );
};

const StyledMainMenu = styled(MainMenu)`
  position: fixed;
  bottom: 3rem;
  right: 3rem;

  .MuiSpeedDialAction-staticTooltipLabel {
    width: 7.65rem;
    text-align: center;
    background-color: #8884d8;
    color: #fff;
    border-radius: 0.6rem;
  }
`;

export default StyledMainMenu;
