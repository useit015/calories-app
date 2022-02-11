import BoltIcon from '@mui/icons-material/Bolt';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { IStatItem } from '../../hooks/useUserMeals';
import { formatCalories } from '../../util/format';

interface IWeeklyStatsProps {
  className?: string;
  children?: ReactNode;
  stats?: IStatItem[];
}

const calculateDifferenceInPercent = (
  current: number,
  previous: number,
): number =>
  !current && !previous
    ? 0
    : Math.round(((current - previous) / previous) * 100);

const WeeklyStats: FC<IWeeklyStatsProps> = ({ className, stats }) => {
  if (!stats || stats.length < 2) {
    return null;
  }
  const [currentWeek, previousWeek] = stats;

  const percentDifference = calculateDifferenceInPercent(
    currentWeek.total,
    previousWeek.total,
  );

  return (
    <Card variant="outlined" className={className}>
      <CardContent className="inner">
        <Stack direction="row" alignItems="center">
          <BoltIcon className="icon" color="primary" />

          <Typography className="amount" variant="subtitle1">
            <span className="value">
              {formatCalories(currentWeek.total) || '0 kcal'}
            </span>
            added this week
          </Typography>
        </Stack>

        {!!previousWeek.total && (
          <Typography className="percent" variant="subtitle1">
            <span
              className={`value ${percentDifference < 0 ? 'error' : 'success'}`}
            >
              {percentDifference > 0 ? '+' : ''}
              {percentDifference}%
            </span>
            since last week
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const StyledWeeklyStats = styled(WeeklyStats)`
  width: 100%;
  margin: 2rem 0;
  border-radius: 1rem;
  background-color: transparent;

  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;

    .icon {
      margin-top: -2.5px;
    }

    .amount,
    .percent {
      letter-spacing: 0.5px;
      font-weight: 300;
      color: #555;

      .value {
        margin: -2px 0.25rem 0;
        font-size: 1.05em;
        font-weight: 500;
      }
    }

    .amount {
      .value {
        color: #8884d8;
      }
    }

    .percent {
      .value {
        &.error {
          color: #d32f2f;
        }

        &.success {
          color: #4caf50;
        }
      }
    }
  }
`;

export default StyledWeeklyStats;
