import DateTimePicker from '@mui/lab/DesktopDateTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FC, ReactNode, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';
import { useAddMeal } from '../../hooks/useAddMeal';
import { useMealForm } from '../../hooks/useMealForm';
import { IOpenToastParams } from '../../hooks/useToast';
import { Autocomplete, SlideUpTransition } from '../atoms';

interface IAddMealProps {
  isOpen: boolean;
  close: () => void;
  className?: string;
  children?: ReactNode;
  onAddMeal: (t: IOpenToastParams) => void;
}

const AddMeal: FC<IAddMealProps> = ({
  className,
  onAddMeal,
  isOpen,
  close,
}) => {
  const {
    rules,
    reset,
    control,
    handleSubmit,
    updateCalories,
    isCaloriesUpdating,
    setIsCaloriesUpdating,
    formState: { errors, isDirty },
  } = useMealForm();

  const handleClose = useCallback(() => {
    reset();

    close();
  }, [close, reset]);

  const { mutate, isLoading } = useAddMeal({
    handleSubmit,
    handleClose,
    onAddMeal,
    reset,
  });

  return (
    <Dialog
      open={isOpen}
      className={className}
      onClose={handleClose}
      TransitionComponent={SlideUpTransition}
    >
      <DialogContent className="inner">
        <Controller
          name="content"
          defaultValue=""
          control={control}
          rules={rules.content}
          render={({ field }) => (
            <Autocomplete
              setIsCaloriesUpdating={setIsCaloriesUpdating}
              errorText={errors.content?.message}
              updateCalories={updateCalories}
              shouldUpdate={isDirty}
              className="input"
              label="Meal"
              autoFocus
              {...field}
            />
          )}
        />

        <Controller
          name="calories"
          defaultValue=""
          control={control}
          rules={rules.calories}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              label="Calories"
              error={!!errors.calories}
              helperText={errors.calories?.message ?? ' '}
              className={`input number-input ${
                isCaloriesUpdating ? 'loading' : ''
              }`}
              InputProps={{
                endAdornment: (
                  <>
                    {isCaloriesUpdating && (
                      <CircularProgress color="inherit" size={20} />
                    )}

                    <InputAdornment position="end">kcal</InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />

        <Controller
          name="date"
          defaultValue=""
          control={control}
          rules={rules.date}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              disableFuture
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  label="Date"
                  className="input"
                  error={!!errors.date}
                  helperText={errors.date?.message ?? ' '}
                />
              )}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <LoadingButton
          fullWidth
          size="large"
          onClick={mutate}
          loading={isLoading}
          variant="contained"
          className="button"
        >
          Add meal
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const StyledAddMeal = styled(AddMeal)`
  .MuiDialog-paper {
    border-radius: 1rem;
    padding: 1rem;

    .inner {
      padding: 1rem 1rem;

      .input {
        margin-bottom: 0.5rem;

        .MuiInputBase-root {
          border-radius: 0.75rem !important;
        }
      }

      .number-input.loading {
        & .MuiOutlinedInput-input {
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }
        }
      }
    }

    .button {
      margin: 0 0.25rem 0.5rem;
      border-radius: 0.75rem;
      min-height: 2.75rem;
    }
  }
`;

export default StyledAddMeal;
