import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  LinearProgress,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';

import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';
import CardWidget from '../../../layouts/dashboard/common/card-widget';

// ----------------------------------------------------------------------
const rowsPerPageOptions = [10, 15, 30];
export default function DashboardView() {
  const kecamatansDummy = [
    {
      village_id: '1',
      village_name: 'A',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
    },
    {
      village_id: '2',
      village_name: 'B',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
    },
    {
      village_id: '3',
      village_name: 'C',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
    },
  ];

  const kelurahansDummy = [
    {
      village_id: '1',
      village_name: 'A',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
    },
    {
      village_id: '2',
      village_name: 'B',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
    },
    {
      village_id: '3',
      village_name: 'C',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
    },
  ];
  const dataPartiesDummy = [
    { party_id: { name: 'partai A' }, total_votes_party: 123 },
    { party_id: { name: 'partai B' }, total_votes_party: 123 },
    { party_id: { name: 'partai C' }, total_votes_party: 123 },
  ];

  const dataAllVotes = [
    {
      village_name: 'village A',
      total_voters: 249,
      total_invalid_ballots: 123,
      total_valid_ballots: 123,
    },
    {
      village_name: 'village B',
      total_voters: 249,
      total_invalid_ballots: 123,
      total_valid_ballots: 123,
    },
    {
      village_name: 'village C',
      total_voters: 249,
      total_invalid_ballots: 123,
      total_valid_ballots: 123,
    },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  // const [dataKecamatans, setKecamatans] = useState([]);
  // const [dataParties, setParties] = useState([]);
  // const [dataAllVotes, setAllVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getGridSize, setGridSize] = useState({
    // default grid size
    Table: {
      xs: 12,
      md: 6,
    },
    Chart: {
      xs: 12,
      md: 6,
    },
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    handleGetAllVotes();
  }, []);

  const handleGetAllVotes = async () => {
    setLoading(true);
    // const getKecamatans = await resultService.getAllDistricts();

    // const getVotes = await resultService.getAllBallots();
    // setKecamatans(getKecamatans.data);
    // setParties(getVotes.data.valid_ballots_detail);
    // setAllVotes(getVotes.data);
    setLoading(false);
  };

  // print area function
  const handlePrint = async () => {
    const prevGridSize = { ...getGridSize };
    const getButton = document.querySelectorAll('.printArea');
    getButton.forEach((element) => {
      element.style.display = 'none';
    });
    // change grid to print
    await setGridSize({
      Table: {
        xs: 7,
        md: 7,
      },
      Chart: {
        xs: 5,
        md: 5,
      },
    });

    reactToPrint();
    // back to default
    setGridSize(prevGridSize);
    getButton.forEach((element) => {
      element.style.display = 'inline';
    });
  };
  const reactToPrint = useReactToPrint({
    pageStyle: `@media print {
      @page {
        size: 100vh;
        margin: 10px;
      }
    }`,
    content: () => pdfRef.current,
  });
  const pdfRef = useRef();

  return (
    <Container maxWidth="xl" ref={pdfRef}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Data Kabupaten Bandung
      </Typography>
      {loading ? (
        <LinearProgress color="primary" variant="query" />
      ) : (
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <CardWidget
              title="Total Hak Suara"
              total={dataAllVotes.total_voters}
              color="success"
              icon={
                <Iconify
                  icon="fluent-emoji-high-contrast:ballot-box-with-ballot"
                  sx={{ width: 64, height: 64 }}
                />
              }
            />
            <Button
              sx={{ marginTop: 2 }}
              onClick={() => handlePrint()}
              variant="contained"
              startIcon={<Iconify icon="fa6-solid:file-pdf" />}
              className="printArea"
            >
              Export Data
            </Button>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <CardWidget
              title="Total Suara Sah"
              total={dataAllVotes.total_valid_ballots}
              color="info"
              icon={
                <Iconify icon="emojione-v1:ballot-box-bold-check" sx={{ width: 64, height: 64 }} />
              }
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <CardWidget
              title="Total Suara Tidak Sah"
              total={dataAllVotes.total_invalid_ballots}
              color="warning"
              icon={<Iconify icon="fxemoji:ballottscriptx" sx={{ width: 64, height: 64 }} />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <CardWidget
              title="Total Kecamatan"
              total={kecamatansDummy.length}
              color="error"
              icon={<Iconify icon="teenyicons:building-outline" sx={{ width: 64, height: 64 }} />}
            />
          </Grid>
          <Grid container lg={12}>
            <Grid xs={getGridSize.Table.xs} md={getGridSize.Table.md} lg={8}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Kecamatan</TableCell>
                      <TableCell align="right">Total Suara</TableCell>
                      <TableCell align="right">Suara Sah</TableCell>
                      <TableCell align="right">Suara Tidak Sah</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kecamatansDummy
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow
                          key={row.district_name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            KECAMATAN {row.district_name}
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
                  count={kelurahansDummy.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Grid>

            <Grid xs={getGridSize.Chart.xs} md={getGridSize.Chart.md} lg={4}>
              <PieChart
                title="Perolehan Suara"
                chart={{
                  series: dataPartiesDummy.map((item) => ({
                    label: item.name,
                    value: item.total_votes_party,
                  })),
                }}
              />
            </Grid>
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <BarChart
              title="Perolehan Suara Per Partai"
              chart={{
                series: dataPartiesDummy.map((item) => ({
                  label: item.name,
                  value: item.total_votes_party,
                })),
              }}
              style={{
                breakBefore: 'page', // Perhatikan penggunaan camelCase di sini
              }}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
