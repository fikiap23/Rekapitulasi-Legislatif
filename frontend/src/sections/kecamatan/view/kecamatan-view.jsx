import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
} from '@mui/material';

import districtService from 'src/services/districtService';

import KecamatanSearch from '../kecamatan-search';
import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';

// ----------------------------------------------------------------------
const rowsPerPageOptions = [10, 15, 30];
export default function KecamatanView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [kecamatans, setKecamatans] = useState([]);
  const [kecamatan, setKecamatan] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetKecamatans();
  }, []);

  const handleGetKecamatans = async () => {
    try {
      setLoading(true);
      const getKecamatans = await districtService.getAllDistricts();

      if (getKecamatans.code === 200) {
        setKecamatans(getKecamatans.data);
      } else {
        setKecamatans([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  const handleKecamatanChange = async (selectedKecamatan) => {
    console.log('Selected Kecamatan:', selectedKecamatan);
    try {
      setLoading(true);
      const getKecamatanVotes = await districtService.getDetailDistrictById(selectedKecamatan._id);
      console.log('Kecamatan Votes:', getKecamatanVotes);
      setKecamatan(getKecamatanVotes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" mb={5}>
        {`Kecamatan ${kecamatan.districtName ?? ''}`}
      </Typography>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <KecamatanSearch kecamatans={kecamatans} onChange={handleKecamatanChange} />
      </Stack>

      {loading && <Typography>Loading...</Typography>}

      {!loading && (
        <Grid container spacing={3}>
          <Grid xs={12} md={6} lg={8}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Kelurahan</TableCell>
                    <TableCell align="right">Total Suara</TableCell>
                    <TableCell align="right">Suara Sah</TableCell>
                    <TableCell align="right">Suara Tidak Sah</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kecamatan.votesSummary &&
                    kecamatan.votesSummary
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow
                          key={row.villageName}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.villageName}
                          </TableCell>
                          <TableCell align="right">{row.totalVillageVoters}</TableCell>
                          <TableCell align="right">{row.totalValid}</TableCell>
                          <TableCell align="right">{row.totalInvalid}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              {kecamatan.votesSummary && (
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOptions}
                  component="div"
                  count={kecamatan.votesSummary.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </TableContainer>
          </Grid>

          {kecamatan.detailedPartyVotes && (
            <>
              <Grid xs={12} md={6} lg={4}>
                <PieChart
                  title="Perolehan Suara"
                  chart={{
                    series: kecamatan.detailedPartyVotes.map(({ code, votes }) => ({
                      label: code,
                      value: votes,
                    })),
                  }}
                />
              </Grid>

              <Grid xs={12} md={12} lg={12}>
                <BarChart
                  title="Perolehan Suara Per Partai"
                  chart={{
                    series: kecamatan.detailedPartyVotes.map(({ code, votes }) => ({
                      label: code,
                      value: votes,
                    })),
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Container>
  );
}
