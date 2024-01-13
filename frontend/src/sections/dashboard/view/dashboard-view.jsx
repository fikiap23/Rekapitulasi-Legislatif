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

import districtService from 'src/services/districtService';

import Iconify from 'src/components/iconify';

import PieChart from '../../../layouts/dashboard/common/pie-chart';
import BarChart from '../../../layouts/dashboard/common/bar-chart';
import CardWidget from '../../../layouts/dashboard/common/card-widget';

// ----------------------------------------------------------------------
const rowsPerPageOptions = [10, 15, 30];
export default function DashboardView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [totalVotesParty, setTotalVotesParty] = useState([]);
  const [kecamatans, setKecamatans] = useState([]);

  useEffect(() => {
    handleGetKecamatans();
  }, []);

  const handleGetKecamatans = async () => {
    try {
      const getKecamatans = await districtService.getAllDistricts();

      if (getKecamatans.code === 200) {
        setKecamatans(getKecamatans.data);

        // Iterate through districts
        getKecamatans.data.forEach((district) => {
          // Iterate through detailed party votes in each district
          district.detailedPartyVotes.forEach((party) => {
            // If the party code doesn't exist in totalVotes, initialize it with the votes
            const existingParty = totalVotesParty.find((item) => item.name === party.code);

            if (!existingParty) {
              totalVotesParty.push({
                name: party.code,
                votes: party.votes,
              });
            } else {
              // If the party code already exists, add the votes to the existing total
              existingParty.votes += party.votes;
            }
          });
        });

        setTotalVotesParty(totalVotesParty);
      } else {
        setKecamatans([]);
      }
    } catch (error) {
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

  const partyChartData = {
    series: totalVotesParty.map(({ name, votes }) => ({
      label: name,
      value: votes,
    })),
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
            total={714000}
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
            total={1352831}
            color="info"
            icon={
              <Iconify icon="emojione-v1:ballot-box-bold-check" sx={{ width: 64, height: 64 }} />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <CardWidget
            title="Total Suara Tidak Sah"
            total={1723315}
            color="warning"
            icon={<Iconify icon="fxemoji:ballottscriptx" sx={{ width: 64, height: 64 }} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <CardWidget
            title="Total Kecamatan"
            total={234}
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
                {kecamatans
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.districtId}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.districtName}
                      </TableCell>
                      <TableCell align="right">{row.totalVoters}</TableCell>
                      <TableCell align="right">{row.totalValidVotes}</TableCell>
                      <TableCell align="right">{row.totalInvalidVotes}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={kecamatans.length}
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
