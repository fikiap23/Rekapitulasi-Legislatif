import { useState } from 'react';

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

import { KECAMATAN } from 'src/_mock/kecamatan';

import SuaraCalegSearch from '../suara_caleg_search';
import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';

// ----------------------------------------------------------------------
const rowsPerPageOptions = [10, 15, 30];
export default function KelurahanView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const SuaraCalegData = [
    {
      id: 1,
      name: 'Asep',
      totalVotes: 100000,
      validVotes: 50000,
      party: 'Party A',
    },
    {
      id: 2,
      name: 'Asep',
      totalVotes: 80000,
      validVotes: 40000,
      party: 'Party B',
    },
  ];

  const partyData = [
    { name: 'Independen', votes: 2000 },
    { name: 'Partai Aceh', votes: 3500 },
    { name: 'Partai Adil Sejahtera Aceh', votes: 1800 },
    { name: 'Partai Amanat Nasional (PAN)', votes: 2500 },
    { name: 'Partai Bulan Bintang (PBB)', votes: 1200 },
    { name: 'Partai Buruh', votes: 3000 },
    { name: 'Partai Darul Aceh', votes: 900 },
    { name: 'Partai Demokrasi Indonesia Perjuangan (PDIP)', votes: 4500 },
    { name: 'Partai Demokrat', votes: 3200 },
    { name: 'Partai Garda Republik Indonesia (GARUDA)', votes: 2800 },
    { name: 'Partai Gelombang Rakyat Indonesia (GELORA)', votes: 1500 },
    { name: "Partai Generasi Atjeh Beusaboh Tha'at Dan Taqwa (GABTHAT)", votes: 2000 },
    { name: 'Partai Gerakan Indonesia Raya (GERINDRA)', votes: 4000 },
    { name: 'Partai Golongan Karya (GOLKAR)', votes: 5000 },
    { name: 'Partai Hati Nurani Rakyat (HANURA)', votes: 1200 },
    { name: 'Partai Keadilan Sejahtera (PKS)', votes: 3500 },
    { name: 'Partai Keadilan dan Persatuan Indonesia (PKPI)', votes: 1800 },
    { name: 'Partai Kebangkitan Bangsa (PKB)', votes: 2500 },
    { name: 'Partai Kebangkitan Nusantara (PKN)', votes: 900 },
    { name: 'Partai Nanggroe Aceh (PNA)', votes: 4500 },
    { name: 'Partai Nasional Demokrat (NASDEM)', votes: 3200 },
    { name: 'Partai Persatuan Indonesia (PERINDO)', votes: 2800 },
    { name: 'Partai Persatuan Pembangunan (PPP)', votes: 1500 },
    { name: 'Partai Solidaritas Indonesia (PSI)', votes: 2000 },
    { name: 'Partai Soliditas Independen Rakyat Aceh (SIRA)', votes: 3500 },
    { name: 'Partai Ummat', votes: 1800 },
  ];

  const partyChartData = {
    series: partyData.map(({ name, votes }) => ({
      label: name,
      value: votes,
    })),
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" mb={5}>
        Data Suara Caleg
      </Typography>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <SuaraCalegSearch kecamatans={KECAMATAN} />
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={8}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Nama Caleg</TableCell>
                  <TableCell>Partai</TableCell>
                  <TableCell align="right">Suara Sah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SuaraCalegData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                  (row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.party}</TableCell>{' '}
                      <TableCell align="right">{row.validVotes}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={SuaraCalegData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <PieChart title="Perolehan Suara" chart={partyChartData} />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <BarChart title="Perolehan Suara Per Partai" chart={partyChartData} />
        </Grid>
      </Grid>
    </Container>
  );
}
