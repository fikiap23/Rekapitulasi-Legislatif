import { useState, useEffect } from 'react';

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
  LinearProgress,
} from '@mui/material';

import partyService from 'src/services/partyService';
import districtService from 'src/services/districtService';

import PartyCard from '../party-card';

// ----------------------------------------------------------------------

export default function PengisianSuaraView() {
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [parties, setParties] = useState([]);
  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votesResult, setVotesResult] = useState([]);
  console.log(votesResult);
  const [history] = useState([
    { id: 1, date: '2022-01-01', user: 'John Doe', action: 'Submitted' },
    { id: 2, date: '2022-01-02', user: 'Jane Smith', action: 'Updated' },
    // Add more history items as needed
  ]);

  useEffect(() => {
    handleGetAllParties();
  }, []);

  const handleGetAllParties = async () => {
    try {
      setLoading(true);
      const result = await partyService.getAllParties();
      const getKecamatans = await districtService.getAllDistricts();
      setKecamatans(getKecamatans.data);
      setParties(result);

      setLoading(false);
    } catch (error) {
      setKecamatans([]);
      setParties([]);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Pengisian Suara
      </Typography>

      {loading && <LinearProgress color="primary" variant="query" />}
      {!loading && (
        <>
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
                onChange={(e) => {
                  setKecamatan(e.target.value);
                  setKelurahans(e.target.value.villages);
                  console.log(e.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Pilih Kecamatan
                </MenuItem>
                {kecamatans.map((option) => (
                  <MenuItem key={option._id} value={option}>
                    {option.district_name}
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
                {kelurahans.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.village_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={5}>
            {parties.map((party) => (
              <Grid item xs={12} sm={6} md={4} key={party._id}>
                <PartyCard party={party} setVotesResult={setVotesResult} />
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
        </>
      )}
    </Container>
  );
}
