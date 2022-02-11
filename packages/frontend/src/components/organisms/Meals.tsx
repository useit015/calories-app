import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { formatDay } from '../../util/format';
import { MealCard } from '../molecules';
import TodayIcon from '@mui/icons-material/Today';

interface IMealsProps {
  meals: any[];
  className?: string;
  children?: ReactNode;
  updateMeal: (meal: any) => void;
  deleteMeal: (meal: any) => void;
}

const Meals: FC<IMealsProps> = ({
  updateMeal,
  deleteMeal,
  className,
  meals,
}) => {
  return (
    <Stack direction="column" className={className}>
      {meals
        .filter(({ total }) => !!total)
        .map(({ day, entries }) => (
          <Box className="day" key={day}>
            <Stack direction="row" className="head" alignItems="center">
              <TodayIcon className="icon" />

              <Typography className="title" variant="h6" component="h3">
                {formatDay(day, true)}
              </Typography>
            </Stack>

            {entries.map((meal: any) => (
              <MealCard
                key={meal.content + meal.date + meal.calories}
                updateMeal={updateMeal}
                deleteMeal={deleteMeal}
                meal={meal}
              />
            ))}
          </Box>
        ))}
    </Stack>
  );
};

const StyledMeals = styled(Meals)`
  width: 100%;
  margin: 1rem 0 3rem;

  .day {
    padding-top: 1rem;

    .head {
      margin-left: 0.5rem;
      margin-bottom: 1.5rem;

      .icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 2px;
        margin-right: 0.5rem;
        fill: #777;
      }

      .title {
        color: #555;
        font-weight: 300;
      }
    }
  }
`;

export default StyledMeals;
