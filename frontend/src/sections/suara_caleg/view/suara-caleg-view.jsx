import { useReactToPrint } from 'react-to-print';
// import JSPdf from 'jspdf';
// import html2canvas from 'html2canvas';
import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, Button, MenuItem, TextField, LinearProgress } from '@mui/material';

// import resultService from 'src/services/resultService';
// import districtService from 'src/services/districtService';
import PieChart from 'src/layouts/dashboard/common/pie-chart';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify/iconify';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function SuaraCalegView() {
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
  const calegsDummy = [
    {
      party_name: 'Partai AAA',
      number_of_votes: 400,
      candidate_data: {
        name: 'CALON 1',
      },
    },
    {
      party_name: 'Partai BBB',
      number_of_votes: 400,
      candidate_data: {
        name: 'CALON 2',
      },
    },
    {
      party_name: 'Partai CCC',
      number_of_votes: 400,
      candidate_data: {
        name: 'CALON C',
      },
    },
  ];
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const [kecamatans, setKecamatans] = useState([]);
  // const [kelurahans, setKelurahans] = useState([]);
  // const [kecamatan, setKecamatan] = useState('');
  // const [kelurahan, setKelurahan] = useState('');
  const [top10Calegs, setTop10Calegs] = useState([]);

  // const [calegs, setCalegs] = useState([]);
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
  });
  const handleGetAllKecamatan = async () => {
    try {
      setLoading(true);

      // const getKecamatans = await districtService.getAllDistricts();
      // const getCalegs = await resultService.getAllCalegs();
      // setKecamatans(getKecamatans.data);
      // setCalegs(getCalegs.data);
      // console.log(getCalegs.data);
      // Sort candidates based on number_of_votes in descending order
      const sortedCalegs = calegsDummy.sort((a, b) => b.number_of_votes - a.number_of_votes);

      // Get the top 10 candidates
      setTop10Calegs(sortedCalegs.slice(0, 10));

      setLoading(false);
    } catch (error) {
      // setKecamatans([]);
      setLoading(false);
    }
  };

  const handleCalegByKecamatan = async (districtId) => {
    try {
      // setCalegs([]);
      // setKelurahan('');
      setLoading(true);
      // const getCalegs = await resultService.getCalegByDistrictId(districtId);
      // setCalegs(getCalegs.data);
      setLoading(false);
    } catch (error) {
      // setCalegs([]);
      // setKelurahan('');
      setLoading(false);
    }
  };

  const handleSelectedKelurahan = async (village_id) => {
    try {
      setLoading(true);
      // setCalegs([]);
      setLoading(true);
      // const getCalegs = await resultService.getCalegByVillageId(village_id);
      // setCalegs(getCalegs.data);
      setLoading(false);
      setLoading(false);
    } catch (error) {
      // setCalegs([]);
      setLoading(false);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: calegsDummy,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

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
    <Container ref={pdfRef}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Calon Legislatif</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        {kelurahansDummy ? (
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Data di Kelurahan {kelurahansDummy.village_name}
          </Typography>
        ) : (
          kecamatansDummy && (
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Data di Kecamatan {kecamatansDummy.district_name}
            </Typography>
          )
        )}
      </Stack>

      {loading && <LinearProgress color="primary" variant="query" />}
      {!loading && (
        <>
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={6} className="printArea">
              <TextField
                fullWidth
                select
                label="Kecamatan"
                value={kecamatansDummy}
                onChange={(e) => {
                  // setKecamatan(e.target.value);
                  // setKelurahans(e.target.value.villages);
                  handleCalegByKecamatan(e.target.value._id);
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
                value={kelurahansDummy}
                onChange={(e) => {
                  // setKelurahan(e.target.value);
                  console.log(e.target.value);
                  handleSelectedKelurahan(e.target.value._id);
                }}
                variant="outlined"
                disabled={!kecamatansDummy}
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

          <Grid item>
            <Card>
              <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

              <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                  <Table>
                    <UserTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleSort}
                      headLabel={[
                        { id: 'isVerified', label: 'No', align: 'center' },
                        { id: 'candidate_data.name', label: 'Nama' },
                        { id: 'party_name', label: 'Partai' },
                        { id: 'number_of_votes', label: 'Jumlah Suara' },
                      ]}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <UserTableRow
                            key={row.candidate_id}
                            no={page * rowsPerPage + index + 1}
                            name={row.candidate_data.name}
                            role={row.number_of_votes}
                            company={row.party_name}
                          />
                        ))}

                      <TableEmptyRows
                        height={77}
                        emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                      />

                      {notFound && <TableNoData query={filterName} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                page={page}
                component="div"
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <PieChart
              title="10 Besar Perolehan Suara Caleg"
              chart={{
                series: top10Calegs.map((item) => ({
                  label: item.candidate_data.name,
                  value: item.number_of_votes,
                })),
              }}
              style={{
                breakBefore: 'page', // Perhatikan penggunaan camelCase di sini
              }}
            />
          </Grid>
        </>
      )}
    </Container>
  );
}
