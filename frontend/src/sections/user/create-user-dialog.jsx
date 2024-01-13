import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Iconify from 'src/components/iconify';

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    kecamatan: '',
    kelurahan: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    console.log(formData);
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={handleClickOpen}
      >
        New User
      </Button>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Buat akun baru</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            autoFocus
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />

          <div style={{ marginTop: '16px' }}>
            {' '}
            {/* Add margin to create space */}
            <InputLabel id="kecamatan-label">Kecamatan</InputLabel>
            <Select
              labelId="kecamatan-label"
              id="kecamatan"
              name="kecamatan"
              value={formData.kecamatan}
              onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
              fullWidth
            >
              <MenuItem value="kecamatan1">Kecamatan 1</MenuItem>
              <MenuItem value="kecamatan2">Kecamatan 2</MenuItem>
              {/* Add more kecamatan options as needed */}
            </Select>
          </div>

          <div style={{ marginTop: '16px' }}>
            {' '}
            {/* Add margin to create space */}
            <InputLabel id="kelurahan-label">Kelurahan</InputLabel>
            <Select
              disabled={!formData.kecamatan}
              labelId="kelurahan-label"
              id="kelurahan"
              name="kelurahan"
              value={formData.kelurahan}
              onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
              fullWidth
            >
              <MenuItem value="kelurahan1">Kelurahan 1</MenuItem>
              <MenuItem value="kelurahan2">Kelurahan 2</MenuItem>
              {/* Add more kelurahan options as needed */}
            </Select>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
