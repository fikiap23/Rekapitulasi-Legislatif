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

// import resultService from 'src/services/resultService';
// import districtService from 'src/services/districtService';

import Iconify from 'src/components/iconify/iconify';

import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';

// ----------------------------------------------------------------------

export default function KelurahanView() {
  // data dummy
  const kecamatansDummy = [
    { district_name: 'A', distric_id: 1 },
    { district_name: 'B', distric_id: 2 },
    { district_name: 'C', distric_id: 3 },
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
  const selectedKelurahanDummy = [
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
  // const [kecamatans, setKecamatans] = useState([]);
  // const [kelurahans, setKelurahans] = useState([]);
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  // const [selectedKelurahan, setSelectedKelurahan] = useState({});
  // const [dataParties, setParties] = useState([]);
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

      // const getKecamatans = await districtService.getAllDistricts();
      // setKecamatans(getKecamatans.data);

      setLoading(false);
    } catch (error) {
      // setKecamatans([]);
      setLoading(false);
    }
  };

  const handleSelectedKelurahan = async (village_id) => {
    try {
      setLoading(true);
      // const getKelurahan = await resultService.getVillageByVillageId(village_id);

      // setSelectedKelurahan(getKelurahan.data);
      // setParties(getKelurahan.data.valid_ballots_detail);
      // console.log(getKelurahan.data.valid_ballots_detail);
      setLoading(false);
    } catch (error) {
      // setSelectedKelurahan({});
      setLoading(false);
    }
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
      element.style.display = 'inline-block';
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
      <Typography variant="h4" mb={5}>
        Data Kelurahan {kelurahan?.village_name}
      </Typography>
      {loading && <LinearProgress color="primary" variant="query" />}

      {!loading && (
        <>
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={6} className="printArea">
              <TextField
                fullWidth
                select
                label="Kecamatan"
                value={kecamatan}
                onChange={(e) => {
                  setKecamatan(e.target.value);
                  // setKelurahans(e.target.value.villages);
                  // console.log(e.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Pilih Kecamatan
                </MenuItem>
                {kecamatansDummy.map((option) => (
                  <MenuItem key={option._id} value={option}>
                    {option.district_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} className="printArea">
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
                {kelurahansDummy.map((option) => (
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
            className="printArea"
          >
            Export Data
          </Button>
          <Grid container spacing={3}>
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
                      {selectedKelurahanDummy && (
                        <TableRow
                          key={selectedKelurahanDummy.village_name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {selectedKelurahanDummy.village_name}
                          </TableCell>
                          <TableCell align="right">{selectedKelurahanDummy.total_voters}</TableCell>
                          <TableCell align="right">
                            {selectedKelurahanDummy.total_invalid_ballots}
                          </TableCell>
                          <TableCell align="right">
                            {selectedKelurahanDummy.total_valid_ballots}
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
                    series: dataPartiesDummy.map((item) => ({
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
                  series: dataPartiesDummy.map((item) => ({
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
