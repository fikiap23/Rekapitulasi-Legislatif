import JSPdf from 'jspdf';
import html2canvas from 'html2canvas';
import { useRecoilValue } from 'recoil';
import { useRef, useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  Stack,
  Button,
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

import Iconify from 'src/components/iconify/iconify';

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

  // print area function
  const handlePrint = () => {
    if (selectedKecamatanName) {
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
          pdf.save(`Data_${selectedKecamatanName}.pdf`);
        });
      });
    }
  };
  const pdfRef = useRef();

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
          <Button
            onClick={() => handlePrint()}
            variant="contained"
            startIcon={<Iconify icon="fa6-solid:file-pdf" />}
          >
            Export Data
          </Button>

          <Grid container spacing={3} ref={pdfRef}>
            <Grid container lg={12} className="printArea">
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
        </>
      )}
    </Container>
  );
}
