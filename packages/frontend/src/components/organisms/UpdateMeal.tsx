import DateTimePicker from '@mui/lab/DesktopDateTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FC, ReactNode, useCallback, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';
import { useMealForm } from '../../hooks/useMealForm';
import { IOpenToastParams } from '../../hooks/useToast';
import { useUpdateMeal } from '../../hooks/useUpdateMeal';
import { Autocomplete, SlideUpTransition } from '../atoms';

interface IUpdateMealProps {
  meal: any;
  className?: string;
  children?: ReactNode;
  unselectMeal: () => void;
  onUpdateMeal: (t: IOpenToastParams) => void;
}

const UpdateMeal: FC<IUpdateMealProps> = ({
  onUpdateMeal,
  unselectMeal,
  className,
  meal,
}) => {
  const {
    rules,
    reset,
    control,
    setValue,
    handleSubmit,
    updateCalories,
    isCaloriesUpdating,
    setIsCaloriesUpdating,
    formState: { errors, isDirty, dirtyFields },
  } = useMealForm();

  const onClose = useCallback(() => {
    reset();

    unselectMeal();
  }, [unselectMeal, reset]);

  useEffect(() => {
    if (meal) {
      ['content', 'calories', 'date'].forEach((field: any) => {
        setValue(field, meal[field]);
      });
    }
  }, [meal, setValue]);

  const { mutate, isLoading } = useUpdateMeal({
    handleClose: unselectMeal,
    mealId: meal?._id,
    onUpdateMeal,
    handleSubmit,
    reset,
  });

  return (
    <Dialog
      open={!!meal}
      onClose={onClose}
      className={className}
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
              {...field}
              label="Meal"
              updateCalories={updateCalories}
              errorText={errors.content?.message}
              setIsCaloriesUpdating={setIsCaloriesUpdating}
              shouldUpdate={isDirty && !!dirtyFields.content}
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
              disabled
              disableFuture
              renderInput={params => (
                <TextField
                  {...params}
                  disabled
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
          onClick={mutate}
          loading={isLoading}
          variant="contained"
          className="button"
          size="large"
        >
          Update meal
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const StyledUpdateMeal = styled(UpdateMeal)`
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

export default StyledUpdateMeal;
