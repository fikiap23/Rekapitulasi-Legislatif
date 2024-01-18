import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
} from '@mui/material';

import partyService from 'src/services/partyService';
import resultService from 'src/services/resultService';

import Iconify from 'src/components/iconify';

import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';
import CardWidget from '../../../layouts/dashboard/common/card-widget';

// ----------------------------------------------------------------------
const rowsPerPageOptions = [10, 15, 30];
export default function DashboardView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const parties = [
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/1/PKB.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/2/Gerindra.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/3/PDIP.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/PARTY/golkar/party%3Dgolkar.png',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/5/Nasdem.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/6/Buruh.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/7/Gelora.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/8/PKS.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/9/PKN.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/10/Hanura.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/12/PAN.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/13/PBB.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/14/Demokrat.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/15/PSI.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/16/Perindo.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/17/PPP.svg',
    'https://goodkind-bucket04939-dev.s3.ap-southeast-1.amazonaws.com/public/assets/constant/partai/24/Ummat.svg',
  ];

  useEffect(() => {
    handleGetAllRegency();
    handleGetAllParties();
    handleGetAllVotes();
  }, []);

  const [dataKecamatans, setKecamatans] = useState([]);
  const handleGetAllRegency = async () => {
    const getKecamatans = await resultService.getAllDistricts();
    setKecamatans(getKecamatans.data);
  };

  const [dataParties, setParties] = useState([]);
  const handleGetAllParties = async () => {
    const getParties = await partyService.getAllParties();
    setParties(getParties);
  };
  const partyChartData = {
    series: dataParties.map(({ name, __v }) => ({
      label: name,
      value: 100,
    })),
  };
  const [dataAllVotes, setAllVotes] = useState([]);
  const handleGetAllVotes = async () => {
    const getVotes = await resultService.getAllBallots();
    setAllVotes(getVotes.data);
  };
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Data Kabupaten Bandung
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <CardWidget
            title="Total Hak Suara"
            total={dataAllVotes.total_invalid_ballots + dataAllVotes.total_valid_ballots}
            color="success"
            icon={
              <Iconify
                icon="fluent-emoji-high-contrast:ballot-box-with-ballot"
                sx={{ width: 64, height: 64 }}
              />
            }
          />
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
            total={dataKecamatans.length}
            color="error"
            icon={<Iconify icon="teenyicons:building-outline" sx={{ width: 64, height: 64 }} />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
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
                {dataKecamatans
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.district_name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        KECAMATAN {row.district_name}
                      </TableCell>
                      <TableCell align="right">
                        {row.total_valid_ballots + row.total_invalid_ballots}
                      </TableCell>
                      <TableCell align="right">{row.total_valid_ballots}</TableCell>
                      <TableCell align="right">{row.total_invalid_ballots}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={dataKecamatans.length}
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

        <Grid container item xs={12} md={12} lg={12}>
          <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kecamatan</TableCell>
                  {parties.map((partyImage, index) => (
                    <TableCell key={index}>
                      <img src={partyImage} alt={`Party ${index + 1}`} style={{ width: '20px' }} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataKecamatans.map((row) => (
                  <TableRow key={row.district_name}>
                    <TableCell>KECAMATAN {row.district_name}</TableCell>
                    {/* {row.votes.map((vote, voteIndex) => (
                      <TableCell key={voteIndex}>{vote}</TableCell>
                    ))} */}
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
