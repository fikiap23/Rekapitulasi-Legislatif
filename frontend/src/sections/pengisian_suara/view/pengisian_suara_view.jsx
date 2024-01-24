import { useSnackbar } from 'notistack';
import { useRecoilValue } from 'recoil';
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
  Accordion,
  Typography,
  IconButton,
  TableContainer,
  LinearProgress,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import userAtom from 'src/atoms/userAtom';
import partyService from 'src/services/partyService';
import resultService from 'src/services/resultService';
import villageService from 'src/services/villageService';
import districtService from 'src/services/districtService';

import Iconify from 'src/components/iconify';

import PartyCard from '../party-card';

// ----------------------------------------------------------------------

export default function PengisianSuaraView() {
  const user = useRecoilValue(userAtom);
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [parties, setParties] = useState([]);
  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votesResult, setVotesResult] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [history, setHistory] = useState([]);
  function convertDateFormat(originalDateString) {
    const originalDate = new Date(originalDateString);

    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(originalDate.getDate()).padStart(2, '0');

    const hours = String(originalDate.getHours()).padStart(2, '0');
    const minutes = String(originalDate.getMinutes()).padStart(2, '0');
    const seconds = String(originalDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
  useEffect(() => {
    const handleGetAllParties = async () => {
      try {
        setLoading(true);
        const result = await partyService.getAllParties();
        if (user.role === 'admin') {
          const getKecamatans = await districtService.getAllDistricts();
          setKecamatans(getKecamatans.data);
        } else if (user.role === 'user_district') {
          const getKelurahans = await villageService.getAllVillageByDistrictId(user.district_id);
          // console.log(getKelurahans.data);
          setKecamatan(user.districtData);
          setKelurahans(getKelurahans.data);
        } else if (user.role === 'user_village') {
          setHistory([]);
          const getHistory = await resultService.getHistoryVillageId(user.village_id);
          // console.log(getHistory.data.history);
          if (getHistory.data.history) {
            setHistory(getHistory.data.history);
          }
          setKelurahan(user.villageData);
        }

        setParties(result);

        setLoading(false);
      } catch (error) {
        setKecamatans([]);
        setParties([]);
        setLoading(false);
      }
    };
    handleGetAllParties();
  }, [user]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (kelurahan === '') {
        enqueueSnackbar('Please select kelurahan', {
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
        setLoading(false);
        return;
      }

      let result;
      if (user.role === 'admin') {
        result = await resultService.fillBallots(kelurahan, votesResult);
      } else if (user.role === 'user_village') {
        result = await resultService.fillBallots(kelurahan._id, votesResult);
        // console.log('kelurahan', kelurahan._id);
      } else if (user.role === 'user_district') {
        result = await resultService.fillBallots(kelurahan, votesResult);
        // console.log('kelurahan', kelurahan);
      }
      if (result.code === 200) {
        console.log(result.data);
        setHistory(result.data.history.history);
        enqueueSnackbar('Voting success', {
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
      setVotesResult([]);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Formulir Pengisian Suara
      </Typography>

      {loading && <LinearProgress color="primary" variant="query" />}
      {!loading && (
        <>
          {history.length > 0 && (
            <Grid container spacing={3} mb={5}>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mb: 3 }} color="primary.main">
                  Riwayat Pengisian Suara
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
                      {history.map((item, index) => (
                        <TableRow key={item._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{convertDateFormat(item.updated_at)}</TableCell>
                          <TableCell>{item.created_by.username}</TableCell>
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
          )}
          {user.role === 'user_village' && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Input suara sah di Kelurahan {kelurahan.village_name}
              </Typography>
              <Grid container spacing={2} mb={5}>
                {parties.map((party) => (
                  <Grid item xs={12} sm={6} md={4} key={party._id}>
                    <PartyCard party={party} setVotesResult={setVotesResult} />
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12} mb={5}>
                <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
            </>
          )}

          {user.role === 'user_district' && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Input suara sah di Kecamatan {kecamatan.district_name}
              </Typography>
              <Grid container spacing={3} mb={5}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Kelurahan"
                    value={kelurahan}
                    onChange={async (e) => {
                      setHistory([]);
                      setKelurahan(e.target.value);
                      const getHistory = await resultService.getHistoryVillageId(e.target.value);
                      // console.log(getHistory.data.history);
                      if (getHistory.data.history) {
                        setHistory(getHistory.data.history);
                      }
                    }}
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
                <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
            </>
          )}

          {user.role === 'admin' && (
            <Accordion>
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5" color="primary.main">
                  Input Suara Sah
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3} mb={5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Kecamatan"
                      value={kecamatan}
                      onChange={(e) => {
                        setKecamatan(e.target.value);
                        setKelurahans(e.target.value.villages);
                        // console.log(e.target.value);
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
                      onChange={async (e) => {
                        setHistory([]);
                        setKelurahan(e.target.value);
                        const getHistory = await resultService.getHistoryVillageId(e.target.value);
                        // console.log(getHistory.data.history);
                        if (getHistory.data.history) {
                          setHistory(getHistory.data.history);
                        }
                      }}
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
                  <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}
    </Container>
  );
}
