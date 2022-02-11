import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, ReactNode, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../store/AuthProvider';
import { formatCalories } from '../../util/format';

interface IGreetingsProps {
  className?: string;
  children?: ReactNode;
  dailyCalories?: number;
  isEmpty?: boolean;
}

const Greetings: FC<IGreetingsProps> = ({
  dailyCalories = 0,
  className,
  isEmpty,
}) => {
  const { user, dailyLimit, isAdmin } = useContext(AuthContext);

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={className}
    >
      <Typography className="title" variant="h4" component="h2">
        Hello {user?.name}
      </Typography>

      {!isAdmin &&
        !isEmpty &&
        (dailyCalories >= dailyLimit ? (
          <Typography className="subtitle error" variant="h6">
            You have reached your daily limit.
          </Typography>
        ) : (
          <Typography className="subtitle success" variant="h6">
            You have got{' '}
            {formatCalories(Math.round(dailyLimit - dailyCalories))} left to
            reach your daily limit.
          </Typography>
        ))}
    </Stack>
  );
};

const StyledGreetings = styled(Greetings)`
  .title {
    line-height: 2;
    letter-spacing: 1px;
    font-weight: 300;
    color: #555;
    text-transform: capitalize;
  }

  .subtitle {
    font-weight: 300;

    &.error {
      color: #d32f2f;
    }

    &.success {
      color: #4caf50;
    }
  }
`;

export default StyledGreetings;
