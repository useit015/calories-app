import MuiAutocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import {
  ChangeEventHandler,
  FC,
  forwardRef,
  SyntheticEvent,
  useCallback,
} from 'react';
import styled from 'styled-components';
import {
  IAutocompleteOption,
  useAutocomplete,
} from '../../hooks/useAutocomplete';
import { IUseMealCaloriesParams } from '../../hooks/useMealCalories';

interface IAutoCompleteProps extends Omit<IUseMealCaloriesParams, 'isOpen'> {
  label?: string;
  className?: string;
  autoFocus?: boolean;
  errorText: string | undefined;
  onChange: (value: string) => void;
}

const Autocomplete: FC<IAutoCompleteProps> = forwardRef(
  (
    {
      setIsCaloriesUpdating,
      updateCalories,
      shouldUpdate,
      errorText,
      autoFocus,
      className,
      onChange,
      value,
      label,
    },
    ref,
  ) => {
    const { isOpen, options, isLoading, updateOptions, onOpen, onClose } =
      useAutocomplete({
        setIsCaloriesUpdating,
        updateCalories,
        shouldUpdate,
        value,
      });

    const onSelect = useCallback(
      (e: SyntheticEvent, value: string) => onChange(value),
      [onChange],
    );

    const onInputChange = useCallback<
      ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    >(
      ({ target }) => {
        updateOptions(target.value);

        onChange(target.value);
      },
      [onChange, updateOptions],
    );

    const isOptionSelected = useCallback(
      (option: IAutocompleteOption, value: IAutocompleteOption) =>
        option.text === value.text,
      [],
    );

    return (
      <MuiAutocomplete
        disableClearable
        selectOnFocus
        fullWidth
        freeSolo
        ref={ref}
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        options={options}
        inputValue={value}
        loading={isLoading}
        className={className}
        filterOptions={x => x}
        onInputChange={onSelect}
        getOptionLabel={({ text }) => text}
        isOptionEqualToValue={isOptionSelected}
        ListboxProps={{ className: 'autocomplete-list' }}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            className="input"
            variant="outlined"
            error={!!errorText}
            autoFocus={autoFocus}
            onChange={onInputChange}
            helperText={errorText ?? ' '}
            InputProps={{
              ...params.InputProps,
              endAdornment: isLoading && (
                <CircularProgress color="inherit" size={20} />
              ),
            }}
          />
        )}
      />
    );
  },
);

const StyledAutocomplete = styled(Autocomplete)``;

export default StyledAutocomplete;
