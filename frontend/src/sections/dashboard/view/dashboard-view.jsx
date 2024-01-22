import JSPdf from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [dataKecamatans, setKecamatans] = useState([]);
  const [dataParties, setParties] = useState([]);
  const [dataAllVotes, setAllVotes] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const getKecamatans = await resultService.getAllDistricts();

    const getVotes = await resultService.getAllBallots();
    setKecamatans(getKecamatans.data);
    setParties(getVotes.data.valid_ballots_detail);
    setAllVotes(getVotes.data);
    setLoading(false);
  };

  // print area function
  const handlePrint = () => {
    const input = pdfRef.current.querySelectorAll('.printArea');
    html2canvas(input[0]).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JSPdf('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      // Page 1
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      pdf.addPage();

      // Page 2
      const secondPageX = 10;
      const secondPageY = 10;

      // Capture and add the second grid to the second page
      html2canvas(input[1]).then((secondGridCanvas) => {
        pdf.addImage(
          secondGridCanvas.toDataURL('image/png'),
          'PNG',
          secondPageX,
          secondPageY,
          imgWidth * ratio,
          imgHeight * ratio
        );
        // Save the PDF
        pdf.save(`Data_Kabupaten Bandung.pdf`);
      });
    });
  };
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
              total={dataKecamatans.length}
              color="error"
              icon={<Iconify icon="teenyicons:building-outline" sx={{ width: 64, height: 64 }} />}
            />
          </Grid>

          <Grid container lg={12} className="printArea">
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
                  count={dataKecamatans.length}
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
          </Grid>

          <Grid xs={12} md={12} lg={12} className="printArea">
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
      )}
    </Container>
  );
}
