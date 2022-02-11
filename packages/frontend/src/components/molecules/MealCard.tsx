import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoltIcon from '@mui/icons-material/Bolt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../store/AuthProvider';
import { formatCalories, formatTime } from '../../util/format';

interface IMealCardProps {
  meal: any;
  className?: string;
  children?: ReactNode;
  updateMeal: (meal: any) => void;
  deleteMeal: (meal: any) => void;
}

const MealCard: FC<IMealCardProps> = ({
  updateMeal,
  deleteMeal,
  className,
  meal,
}) => {
  const { content, calories, date, author } = meal;

  const { isAdmin } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback(
    ({ currentTarget }: MouseEvent<HTMLButtonElement>) =>
      setAnchorEl(currentTarget),
    [],
  );

  const withHandleClose = useCallback(
    (callback?: Function) => () => {
      callback?.();

      setAnchorEl(null);
    },
    [],
  );

  const authorName = useMemo(
    () => (isAdmin && !!author ? `by ${author.name}` : ''),
    [isAdmin, author],
  );

  const actions = useMemo(
    () => [
      {
        action: () => updateMeal(meal),
        Icon: EditIcon,
        text: 'Edit',
      },
      {
        action: () => deleteMeal(meal),
        Icon: DeleteOutlineIcon,
        color: 'error' as 'error',
        text: 'Delete',
      },
    ],
    [deleteMeal, meal, updateMeal],
  );

  return (
    <Stack className={`${className} ${authorName ? 'with-author' : ''}`}>
      <Card variant="outlined" className="card">
        <CardContent className="inner">
          <Stack direction="row" className="meal" alignItems="center">
            <RestaurantMenuIcon fontSize="small" color="primary" />

            <Typography className="value" variant="body1">
              {content}
            </Typography>
          </Stack>

          <Stack direction="row" className="calories" alignItems="center">
            <BoltIcon fontSize="small" color="primary" />

            <Typography variant="body1" className="value">
              {formatCalories(calories)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            className="date"
            alignItems="center"
            justifyContent="center"
          >
            <AccessTimeIcon fontSize="small" color="primary" />

            <Typography variant="body1" className="value">
              {formatTime(date)}
            </Typography>
          </Stack>

          <IconButton className="actions" onClick={handleClick}>
            <MoreVertIcon color="primary" />
          </IconButton>

          <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={withHandleClose()}
            MenuListProps={{ dense: true }}
            classes={{ paper: 'menu-list' }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {actions.map(({ action, Icon, text, color }, i) =>
              [
                !!i && <Divider key="divider" />,
                <MenuItem onClick={withHandleClose(action)} key={text}>
                  <ListItemIcon>
                    <Icon color={color} fontSize="small" />
                  </ListItemIcon>

                  <ListItemText
                    primaryTypographyProps={{
                      color,
                    }}
                  >
                    {text}
                  </ListItemText>
                </MenuItem>,
              ].filter(Boolean),
            )}
          </Menu>
        </CardContent>
      </Card>

      <Typography variant="caption" className="author">
        {authorName}
      </Typography>
    </Stack>
  );
};

const StyledMealCard = styled(MealCard)`
  margin: 1rem 0;

  &.with-author {
    margin: 0.5rem 0;
  }

  .author {
    color: #777;
    padding: 0.25rem 1rem;
    text-align: right;
    text-transform: capitalize;
  }

  .card {
    border-radius: 1rem;

    .inner {
      padding: 0.75rem 1.5rem !important;
      display: grid;
      align-items: center;
      grid-template-columns: 4fr 2.5fr 2fr 2fr;

      .value {
        letter-spacing: 0.5px;
      }

      .meal {
        .value {
          font-weight: 500;
          margin-left: 0.5rem;
          text-transform: capitalize;
          color: #555;
        }
      }

      .date,
      .calories,
      .actions {
        justify-self: flex-end;

        .value {
          font-size: 0.95em;
          color: #333;
          font-weight: 300;
          margin-bottom: -3px;
          margin-left: 5px;
        }
      }
    }
  }
`;

export default StyledMealCard;
