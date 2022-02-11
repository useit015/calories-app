import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FC, ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IFormInput, useLogin } from '../../hooks/useLogin';
import { useLoginValidationRules } from '../../hooks/useLoginValidationRules';
import { PasswordInput } from '../atoms';

interface ILoginFormProps {
  className?: string;
  children?: ReactNode;
}

const LoginForm: FC<ILoginFormProps> = ({ className }) => {
  const rules = useLoginValidationRules();

  const { control, handleSubmit, formState, setError } = useForm<IFormInput>();

  const { mutate: login, isLoading } = useLogin(handleSubmit, setError);

  return (
    <Box component="form" className={className} onSubmit={login}>
      <Controller
        name="email"
        defaultValue=""
        control={control}
        rules={rules.email}
        render={({ field }) => (
          <TextField
            autoFocus
            fullWidth
            label="Email"
            className="input"
            error={!!formState.errors.email}
            helperText={formState.errors.email?.message ?? ' '}
            {...field}
          />
        )}
      />

      <Controller
        name="password"
        defaultValue=""
        control={control}
        rules={rules.password}
        render={({ field }) => (
          <PasswordInput
            errorText={formState.errors.password?.message}
            {...field}
          />
        )}
      />

      <LoadingButton
        fullWidth
        type="submit"
        className="button"
        variant="contained"
        loading={isLoading}
      >
        Sign In
      </LoadingButton>
    </Box>
  );
};

const StyledLoginForm = styled(LoginForm)`
  .button {
    margin-top: 2rem;
    border-radius: 0.75rem;
    min-height: 2.75rem;
  }

  .input {
    margin-bottom: 1rem;

    .MuiInputBase-root {
      border-radius: 0.75rem !important;
    }
  }
`;

export default StyledLoginForm;
