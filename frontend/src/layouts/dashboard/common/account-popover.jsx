import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import userAtom from 'src/atoms/userAtom';
import { account } from 'src/_mock/account';
import authService from 'src/services/authService';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Ganti Password',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const user = useRecoilValue(userAtom);
  const [open, setOpen] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      const result = await authService.logoutUser();
      if (result.code === 200) {
        localStorage.removeItem('user-pileg');
        setUser(null);
        enqueueSnackbar('Logout Success', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          action: (key) => (
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => closeSnackbar(key)}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    handleClose();
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handlePasswordChange = async () => {
    try {
      // Ganti kata sandi logic here
      setLoading(true);
      const result = await authService.changePassword(user._id, { oldPassword, newPassword });
      if (result.code === 200) {
        console.log(result);
        setOldPassword('');
        setNewPassword('');
        enqueueSnackbar('Password changed successfully', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          action: (key) => (
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => closeSnackbar(key)}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          ),
        });
        handleClosePasswordDialog();
      } else {
        enqueueSnackbar(result.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          action: (key) => (
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => closeSnackbar(key)}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          ),
        });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to change password', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        action: (key) => (
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => closeSnackbar(key)}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        ),
      });
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={user.username}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.role}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleOpenPasswordDialog}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>

      {/* Dialog ganti kata sandi */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Ganti Kata Sandi</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Kata Sandi Lama"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Kata Sandi Baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Batal</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            {loading ? 'Loading...' : ' Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
