import BoltIcon from '@mui/icons-material/Bolt';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { formatCalories, formatDay } from '../../util/format';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PeopleIcon from '@mui/icons-material/People';

interface IChartTooltipProps {
  isUserChart?: boolean;
  children?: ReactNode;
  dailyLimit?: number;
  className?: string;
  active?: boolean;
  isUser: boolean;
  label?: string;
  payload?: {
    value: number;
    dataKey: string;
    payload: Record<string, number>;
  }[];
}

const ChartTooltip: FC<IChartTooltipProps> = ({
  isUserChart,
  dailyLimit,
  className,
  payload,
  isUser,
  active,
  label,
}) => {
  if (!active || !payload?.length || !label) {
    return <div className={className} />;
  }

  const dailyCalories: number =
    payload?.find(({ dataKey }) => dataKey === 'calories')?.value ?? 0;

  return (
    <Card className={className} variant="outlined">
      <CardContent className="inner">
        {!isUserChart && (
          <Typography className="title" variant="body1">
            {formatDay(label, true)}
          </Typography>
        )}

        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="center"
        >
          {isUserChart && (
            <Stack
              direction="row"
              className="entry"
              alignItems="center"
              justifyContent="center"
            >
              <PeopleIcon
                className="icon users"
                fontSize="small"
                color="primary"
              />

              <Typography variant="body2" className="text">
                {payload[0].payload.user}
              </Typography>
            </Stack>
          )}

          {payload
            .sort((a, b) => b.dataKey.localeCompare(a.dataKey))
            .map(({ dataKey, value }) => {
              if (dataKey === 'users') {
                if (!value) {
                  return null;
                }

                return (
                  <Stack
                    direction="row"
                    className="entry"
                    alignItems="center"
                    justifyContent="center"
                    key={dataKey + value}
                  >
                    <PeopleIcon
                      className="icon users"
                      fontSize="small"
                      color="primary"
                    />

                    <Typography variant="body2" className="text">
                      {`${value} ${value === 1 ? 'user' : 'users'}`}
                    </Typography>
                  </Stack>
                );
              }

              if (dataKey === 'calories') {
                if (!value) {
                  return null;
                }

                return (
                  <Stack
                    direction="row"
                    className="entry"
                    alignItems="center"
                    justifyContent="center"
                    key={dataKey + value}
                  >
                    <BoltIcon
                      className="icon"
                      fontSize="small"
                      color="primary"
                    />

                    <Typography variant="body2" className="text">
                      {formatCalories(value)}
                      <small>{isUserChart && ' per meal'}</small>
                    </Typography>
                  </Stack>
                );
              }

              return (
                <Stack
                  direction="row"
                  className="entry"
                  alignItems="center"
                  justifyContent="center"
                  key={dataKey + value}
                >
                  <RestaurantMenuIcon
                    fontSize="small"
                    className="icon"
                    color={value ? 'secondary' : 'error'}
                  />

                  <Typography variant="body2" className="text">
                    {value
                      ? `${value} ${value === 1 ? 'meal' : 'meals'}`
                      : 'No meals'}
                  </Typography>
                </Stack>
              );
            })}

          {isUser && dailyLimit && dailyCalories > dailyLimit && (
            <Stack
              direction="row"
              alignItems="center"
              className="entry error"
              justifyContent="center"
            >
              <PriorityHighIcon
                fontSize="small"
                className="icon"
                color="error"
              />

              <Typography variant="body2" color="error" className="text error">
                You have exceeded your daily calorie limit.
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const StyledChartTooltip = styled(ChartTooltip)`
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);

  .inner {
    padding: 0.5rem 1.25rem;

    .text,
    .title {
      letter-spacing: 0.5px;
      color: #555;
    }

    .text {
      margin-bottom: 0.5px;

      &.error {
        color: #d32f2f;
        font-size: 0.8em;
      }
    }

    .title {
      font-size: 0.97em;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .icon {
      margin-right: 5px;
      transform: scale(0.95);

      &.users {
        fill: #ffa388;
      }
    }

    .entry {
      padding-bottom: 2px;

      &.error {
        padding-bottom: 4px;
        padding-top: 2px;
      }
    }
  }
`;

export default StyledChartTooltip;
