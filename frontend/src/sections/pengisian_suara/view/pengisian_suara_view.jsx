import { useState } from 'react';

import Container from '@mui/material/Container';
import {
  Grid,
  Table,
  Paper,
  Button,
  MenuItem,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { dummyKecamatan, dummyKelurahan } from 'src/_mock/kecamatan';

import PartyCard from '../party-card';

// ----------------------------------------------------------------------

export default function PengisianSuaraView() {
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');

  const [history] = useState([
    { id: 1, date: '2022-01-01', user: 'John Doe', action: 'Submitted' },
    { id: 2, date: '2022-01-02', user: 'Jane Smith', action: 'Updated' },
    // Add more history items as needed
  ]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Pengisian Suara
      </Typography>
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            // onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Kecamatan"
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Pilih Kecamatan
            </MenuItem>
            {dummyKecamatan.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Kelurahan"
            value={kelurahan}
            onChange={(e) => setKelurahan(e.target.value)}
            variant="outlined"
            disabled={!kecamatan}
          >
            <MenuItem value="" disabled>
              Pilih Desa / Kelurahan
            </MenuItem>
            {dummyKelurahan
              .filter((option) => option.kecamatanId === kecamatan)
              .map((filteredOption) => (
                <MenuItem key={filteredOption.id} value={filteredOption.id}>
                  {filteredOption.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={5}>
        {/* map dummy */}
        {Array.from({ length: 18 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <PartyCard />
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} mb={5}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Grid>
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Riwayat Perubahan
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.user}</TableCell>
                    <TableCell>
                      <Button>Lihat</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
