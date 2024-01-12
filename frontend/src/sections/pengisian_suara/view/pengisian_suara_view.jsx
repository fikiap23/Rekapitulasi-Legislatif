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

// ----------------------------------------------------------------------

export default function PengisianSuaraView() {
  const parties = [
    {
      name: 'Partai Kebangkitan Bangsa',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/13/PBB.svg',
    },
    {
      name: 'Partai Gerakan Indonesia Raya',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/2/Gerindra.svg',
    },
    {
      name: 'Partai Demokrasi Indonesia Perjuangan',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/3/PDIP.svg',
    },
    {
      name: 'Partai Golongan Karya',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/PARTY/golkar/party%3Dgolkar.png',
    },
    {
      name: 'Partai Nasional Demokrat',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/5/Nasdem.svg',
    },
    {
      name: 'Partai Buruh',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/6/Buruh.svg',
    },
    {
      name: 'Gelombang Rakyat Indonesia',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/7/Gelora.svg',
    },
    {
      name: 'Partai Keadilan Sejahtera',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/8/PKS.svg',
    },
    {
      name: 'Partai Kebangkitan Nusantara',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/9/PKN.svg',
    },
    {
      name: 'Partai Hati Nurani Rakyat',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/10/Hanura.svg',
    },
    {
      name: 'Partai Amanat Nasional',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/12/PAN.svg',
    },
    {
      name: 'Partai Bulan Bintang',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/13/PBB.svg',
    },
    {
      name: 'Partai Demokrat',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/14/Demokrat.svg',
    },
    {
      name: 'Partai Solidaritas Indonesia',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/15/PSI.svg',
    },
    {
      name: 'Partai Persatuan Indonesia',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/16/Perindo.svg',
    },
    {
      name: 'Partai Persatuan Pembangunan',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/17/PPP.svg',
    },
    {
      name: 'Partai Ummat',
      logoSrc:
        'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/24/Ummat.svg',
    },
  ];

  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');

  const dummyKecamatan = [
    { id: '1', name: 'Kecamatan A' },
    { id: '2', name: 'Kecamatan B' },
    { id: '3', name: 'Kecamatan C' },
  ];

  const dummyKelurahan = [
    { id: '1', name: 'Kelurahan 1', kecamatanId: '1' },
    { id: '2', name: 'Kelurahan 2', kecamatanId: '2' },
    { id: '3', name: 'Kelurahan 3', kecamatanId: '3' },
  ];

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
            {/* Replace with actual kecamatan options */}
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
            disabled={!kecamatan} // Disable kelurahan select until kecamatan is selected
          >
            {/* Replace with actual kelurahan options */}
            {dummyKelurahan.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={5}>
        {parties.map((party, index) => (
          <Grid key={index} item md={3}>
            <Typography variant="subtitle2" style={{ fontSize: '12px' }}>
              {party.name}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={party.logoSrc}
                alt={party.name}
                style={{ width: '40px', marginRight: '10px' }}
              />
              <TextField variant="outlined" fullWidth type="number" />
            </div>
          </Grid>
        ))}
      </Grid>

      <Grid item xs={12} mb={5}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Grid>

      <Grid container spacing={3} mb={5}>
        {/* New Grid for History */}
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
