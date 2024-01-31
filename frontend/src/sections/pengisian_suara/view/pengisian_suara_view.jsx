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
  TableContainer,
  LinearProgress,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import userAtom from 'src/atoms/userAtom';
import partyService from 'src/services/partyService';

import Iconify from 'src/components/iconify';

import PartyCard from '../party-card';
import DetailHistory from '../detail-history-dialog';

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
  const [history, setHistory] = useState([]);
  // console.log(votesResult);
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
        const result = await partyService.getAllPartiesWithcandidates();

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
                            <DetailHistory parties={item.valid_ballots_detail} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
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
                        // const getHistory = await resultService.getHistoryVillageId(e.target.value);
                        // // console.log(getHistory.data.history);
                        // if (getHistory.data.history) {
                        //   setHistory(getHistory.data.history);
                        // }
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
