import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, ReactNode, useContext, useMemo } from 'react';
import styled from 'styled-components';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import Button from '@mui/material/Button';
import { AuthContext } from '../../store/AuthProvider';

interface IBlankStateProps {
  className?: string;
  children?: ReactNode;
  action?: () => void;
}

const BlankState: FC<IBlankStateProps> = ({ className, action }) => {
  const { isAdmin } = useContext(AuthContext);

  const { title, actionText } = useMemo(
    () => ({
      title: isAdmin
        ? 'Start by inviting users!'
        : 'Start by adding some meals!',
      actionText: isAdmin ? 'Invite' : 'Add meal',
    }),
    [isAdmin],
  );

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={className}
    >
      <Inventory2Icon
        color="primary"
        fontSize="large"
        className="blank-state-icon"
      />

      <Typography variant="h5" className="blank-state-title">
        {title}
      </Typography>

      <Typography variant="subtitle1" className="blank-state-subtitle">
        Before we can create any charts, we'll first need to get some data in
        here!
      </Typography>

      <Button
        size="large"
        onClick={action}
        variant="contained"
        className="blank-state-button"
      >
        {actionText}
      </Button>
    </Stack>
  );
};

const StyledBlankState = styled(BlankState)`
  .blank-state {
    &-icon {
      width: 8rem;
      height: 8rem;
      margin: 3rem 0 2rem;
    }

    &-subtitle,
    &-title {
      color: #555;
      font-weight: 300;
      letter-spacing: 1px;
    }

    &-title {
      font-size: 1.75em;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
    }

    &-button {
      margin: 3rem 0;
      border-radius: 1rem;
      min-height: 2.75rem;
      padding-left: 3rem;
      padding-right: 3rem;
    }
  }
`;

export default StyledBlankState;
