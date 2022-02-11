import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { IOpenToastParams } from '../../hooks/useToast';
import { request } from '../../util/request';
import { SlideUpTransition } from '../atoms';

interface IDeleteMealProps {
  meal: any;
  className?: string;
  children?: ReactNode;
  unselectMeal: () => void;
  onDeleteMeal: (t: IOpenToastParams) => void;
}

const DeleteMeal: FC<IDeleteMealProps> = ({
  onDeleteMeal,
  unselectMeal,
  className,
  meal,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    async () => {
      const data = await request({
        url: `/meal/${meal._id}`,
        method: 'DELETE',
      });

      queryClient.invalidateQueries('meals');

      onDeleteMeal({
        message: 'Meal deleted successfully',
      });

      unselectMeal();

      return data;
    },
    {
      onError: (error: any) => {
        onDeleteMeal({
          status: 'error',
          message:
            error?.response?.data?.message ??
            'Something went wrong, please try again later',
        });
      },
    },
  );

  return (
    <Dialog
      open={!!meal}
      className={className}
      onClose={unselectMeal}
      TransitionComponent={SlideUpTransition}
    >
      <DialogTitle className="title">This action cannot be undone.</DialogTitle>

      <DialogContent className="inner">
        <DeleteForeverIcon className="icon" color="error" />

        <Typography className="text">
          The following meal will be deleted:
        </Typography>

        <Typography className="meal" variant="subtitle2">
          {meal?.content}
        </Typography>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          fullWidth
          color="error"
          className="button"
          variant="contained"
          loading={isLoading}
          onClick={() => mutate()}
        >
          Delete meal
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const StyledDeleteMeal = styled(DeleteMeal)`
  .MuiDialog-paper {
    border-radius: 1rem;
    padding: 1rem;

    .title {
      font-size: 1.5em;
      letter-spacing: 1px;
      font-weight: 300;
    }

    .inner {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 1rem 1rem;

      .icon {
        width: 10rem;
        height: 10rem;
        margin-bottom: 1rem;
        opacity: 0.9;
      }

      .text {
        font-weight: 300;
        letter-spacing: 0.5px;
      }

      .meal {
        font-weight: 500;
        color: #d32f2f;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-top: 0.25rem;
      }
    }

    .button {
      margin: 0 0.25rem;
      border-radius: 0.75rem;
      min-height: 2.75rem;
    }
  }
`;

export default StyledDeleteMeal;
