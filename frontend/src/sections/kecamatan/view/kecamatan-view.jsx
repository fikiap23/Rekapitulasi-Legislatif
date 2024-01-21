import { useRecoilValue } from 'recoil';
import { useState, useEffect } from 'react';

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
  LinearProgress,
  TablePagination,
} from '@mui/material';

import userAtom from 'src/atoms/userAtom';
import resultService from 'src/services/resultService';

import KecamatanSearch from '../kecamatan-search';
import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';

// ----------------------------------------------------------------------
const rowsPerPageOptions = [10, 15, 30];
export default function KecamatanView() {
  const user = useRecoilValue(userAtom);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [kecamatans, setKecamatans] = useState([]);
  const [selectedKecamatanName, setSelectedKecamatanName] = useState('');
  const [dataParties, setParties] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGetAllKecamatans = async () => {
      setLoading(true);
      if (user.role === 'admin') {
        const getKecamatans = await resultService.getAllDistricts();
        setKecamatans(getKecamatans.data);
        setLoading(false);
      } else if (user.role === 'user_district') {
        setSelectedKecamatanName(user.districtData.district_name);
        setLoading(true);
        const getKelurahans = await resultService.getAllVillagesByDistrict(user.district_id);
        const getParties = await resultService.getAllBallotsByDistrictId(user.district_id);
        setParties(getParties.valid_ballots_detail);
        setKelurahans(getKelurahans.data);
        setLoading(false);
      }

      setLoading(false);
    };
    handleGetAllKecamatans();
  }, [user]);

  const handleSelectKecamatan = async (selectedKecamatan) => {
    // console.log(selectedKecamatan.district_id);
    setSelectedKecamatanName(selectedKecamatan.district_name);
    setLoading(true);
    const getKelurahans = await resultService.getAllVillagesByDistrict(
      selectedKecamatan.district_id
    );
    const getParties = await resultService.getAllBallotsByDistrictId(selectedKecamatan.district_id);
    setParties(getParties.valid_ballots_detail);
    // console.log(getParties.valid_ballots_detail);
    setKelurahans(getKelurahans.data);
    // console.log(getKelurahans.data);
    setLoading(false);
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
        Data Kecamatan {selectedKecamatanName}
      </Typography>
      {loading && <LinearProgress color="primary" variant="query" />}
      {!loading && (
        <>
          {user.role === 'admin' && (
            <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
              <KecamatanSearch kecamatans={kecamatans} onSelectKecamatan={handleSelectKecamatan} />
            </Stack>
          )}

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
                    {kelurahans
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow
                          key={row.village_id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.village_name}
                          </TableCell>
                          <TableCell align="right">{row.total_voters}</TableCell>
                          <TableCell align="right">{row.total_valid_ballots}</TableCell>
                          <TableCell align="right">{row.total_invalid_ballots}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOptions}
                  component="div"
                  count={kelurahans.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Grid>

            <Grid xs={12} md={6} lg={4}>
              <PieChart
                title="Perolehan Suara"
                chart={{
                  series: dataParties.map((item) => ({
                    label: item.name,
                    value: item.total_votes_party,
                  })),
                }}
              />
            </Grid>

            <Grid xs={12} md={12} lg={12}>
              <BarChart
                title="Perolehan Suara Per Partai"
                chart={{
                  series: dataParties.map((item) => ({
                    label: item.name,
                    value: item.total_votes_party,
                  })),
                }}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
