import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import userAtom from 'src/atoms/userAtom';
import { bgGradient } from 'src/theme/css';
import authService from 'src/services/authService';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const setUser = useSetRecoilState(userAtom);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      // check if username and password are not empty
      if (!userData.username || !userData.password) {
        alert('Please enter username and password');
        return;
      }
      setLoading(true);
      const result = await authService.loginUser(userData);
      if (result.code === 200) {
        localStorage.setItem('user-pileg', JSON.stringify(result.data));
        setUser(result.data);
        alert('Login success');
        router.push('/');
      }

      setLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
      setLoading(false);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Username"
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        />

        <TextField
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Lupa Password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleLogin}
      >
        {loading ? 'Loading...' : 'Login'}
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" align="center">
            MONITOR PILEG
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }} align="center">
            Masukkan username & password untuk login
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
