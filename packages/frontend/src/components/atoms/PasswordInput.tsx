import { Visibility, VisibilityOff } from '@mui/icons-material';
import { OutlinedInputProps } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  FC,
  forwardRef,
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

interface IPasswordInputProps {
  className?: string;
  children?: ReactNode;
  errorText: string | undefined;
}

const PasswordInput: FC<IPasswordInputProps & OutlinedInputProps> = forwardRef(
  ({ errorText, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = useCallback(() => setShowPassword(v => !v), []);

    const handleMouseDown = useCallback(
      (e: MouseEvent<HTMLButtonElement>): void => e.preventDefault(),
      [],
    );

    const { Icon, type } = useMemo(
      () => ({
        Icon: showPassword ? Visibility : VisibilityOff,
        type: showPassword ? 'text' : 'password',
      }),
      [showPassword],
    );

    return (
      <FormControl
        fullWidth
        className="input"
        variant="outlined"
        error={!!errorText}
      >
        <InputLabel htmlFor="password-input">Password</InputLabel>

        <OutlinedInput
          {...props}
          label="Password"
          type={type}
          ref={ref}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={toggleShowPassword}
                onMouseDown={handleMouseDown}
              >
                <Icon />
              </IconButton>
            </InputAdornment>
          }
        />

        <FormHelperText>{errorText ?? ' '}</FormHelperText>
      </FormControl>
    );
  },
);

export default PasswordInput;
