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
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  TableContainer,
  LinearProgress,
} from '@mui/material';

import resultService from 'src/services/resultService';
import districtService from 'src/services/districtService';

import Iconify from 'src/components/iconify/iconify';

import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';

// ----------------------------------------------------------------------

export default function KelurahanView() {
  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState({});
  const [dataParties, setParties] = useState([]);
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

  useEffect(() => {
    handleGetAllKecamatan();
  }, []);
  const handleGetAllKecamatan = async () => {
    try {
      setLoading(true);

      const getKecamatans = await districtService.getAllDistricts();
      setKecamatans(getKecamatans.data);

      setLoading(false);
    } catch (error) {
      setKecamatans([]);
      setLoading(false);
    }
  };

  const handleSelectedKelurahan = async (village_id) => {
    try {
      setLoading(true);
      const getKelurahan = await resultService.getVillageByVillageId(village_id);

      setSelectedKelurahan(getKelurahan.data);
      setParties(getKelurahan.data.valid_ballots_detail);
      console.log(getKelurahan.data.valid_ballots_detail);
      setLoading(false);
    } catch (error) {
      setSelectedKelurahan({});
      setLoading(false);
    }
  };

  // print area function
  const handlePrint = async () => {
    const prevGridSize = { ...getGridSize };
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
    <Container maxWidth="xl">
      <Typography variant="h4" mb={5}>
        Data Kelurahan {kelurahan?.village_name}
      </Typography>
      {loading && <LinearProgress color="primary" variant="query" />}

      {!loading && (
        <>
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
                onChange={(e) => {
                  setKelurahan(e.target.value);
                  console.log(e.target.value);
                  handleSelectedKelurahan(e.target.value._id);
                }}
                variant="outlined"
                disabled={!kecamatan}
              >
                <MenuItem value="" disabled>
                  Pilih Desa / Kelurahan
                </MenuItem>
                {kelurahans.map((option) => (
                  <MenuItem key={option._id} value={option}>
                    {option.village_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Button
            onClick={() => handlePrint()}
            variant="contained"
            startIcon={<Iconify icon="fa6-solid:file-pdf" />}
          >
            Export Data
          </Button>
          <Grid container spacing={3} ref={pdfRef}>
            <Grid container lg={12}>
              <Grid xs={getGridSize.Table.xs} md={getGridSize.Table.xs} lg={8}>
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
                      {selectedKelurahan && (
                        <TableRow
                          key={selectedKelurahan.village_name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {selectedKelurahan.village_name}
                          </TableCell>
                          <TableCell align="right">{selectedKelurahan.total_voters}</TableCell>
                          <TableCell align="right">
                            {selectedKelurahan.total_invalid_ballots}
                          </TableCell>
                          <TableCell align="right">
                            {selectedKelurahan.total_valid_ballots}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid xs={getGridSize.Chart.xs} md={getGridSize.Chart.md} lg={4}>
                <PieChart
                  title="Perolehan Suara"
                  chart={{
                    series: dataParties.map((item) => ({
                      label: item.party_id.name,
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
                  series: dataParties.map((item) => ({
                    label: item.party_id.name,
                    value: item.total_votes_party,
                  })),
                }}
                style={{
                  breakBefore: 'page', // Perhatikan penggunaan camelCase di sini
                }}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
