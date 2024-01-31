import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, MenuItem, TextField, LinearProgress } from '@mui/material';

// import villageService from 'src/services/villageService';
// import districtService from 'src/services/districtService';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function StatusPengisianView() {
  const kecamatansDummy = [
    { district_name: 'A', distric_id: 1 },
    { district_name: 'B', distric_id: 2 },
    { district_name: 'C', distric_id: 3 },
  ];
  const kelurahansDummy = [
    {
      _id: '1',
      village_name: 'A',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
      is_fillBallot: 'Sudah Mengisi',
      district_name: 'A',
    },
    {
      _id: '2',
      village_name: 'B',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
      is_fillBallot: '',
      district_name: 'B',
    },
    {
      _id: '3',
      village_name: 'C',
      total_voters: 123,
      total_valid_ballots: 123,
      total_invalid_ballots: 123,
      is_fillBallot: 'Sudah Mengisi',
      district_name: 'C',
    },
  ];
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const [kecamatans, setKecamatans] = useState([]);
  // const [kelurahans, setKelurahans] = useState([]);
  const [kecamatan, setKecamatan] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGetAllKecamatan = async () => {
      try {
        setLoading(true);

        // const getKecamatans = await districtService.getAllDistrictNames();

        // const getVillages = await villageService.getAllVillages();
        // // console.log(getVillages.data);
        // setKelurahans(getVillages.data);
        // setKecamatans(getKecamatans.data);

        setLoading(false);
      } catch (error) {
        // setKecamatans([]);
        setLoading(false);
      }
    };
    handleGetAllKecamatan();
  }, []);

  const handleSelectKecamatan = async (districtId) => {
    try {
      setLoading(true);
      // setKelurahans([]);

      // const getVillages = await villageService.getAllVillageByDistrictId(districtId);
      // console.log(getVillages.data);

      // if (getVillages.code === 200) {
      //   setKelurahans(getVillages.data);
      // }

      setLoading(false);
    } catch (error) {
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
    inputData: kelurahansDummy,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Status Pengisian Suara</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        {kecamatan && (
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Data di Kecamatan {kecamatan.district_name}
          </Typography>
        )}
      </Stack>

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

                  // console.log(e.target.value);
                  handleSelectKecamatan(e.target.value._id);
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
          </Grid>

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
                        { id: 'no', label: 'No', align: 'center' },
                        { id: 'village_name', label: 'Kelurahan' },
                        { id: 'district_name', label: 'kecamatan' },
                        { id: 'is_fillBallot', label: 'Status Pengisian' },
                        { id: 'aksi', label: 'Aksi', align: 'center' },
                      ]}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <UserTableRow
                            key={row._id}
                            no={page * rowsPerPage + index + 1}
                            village_name={row.village_name}
                            village_id={row._id}
                            status={row.is_fillBallot}
                            district_name={row.district_name}
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
        </>
      )}
    </Container>
  );
}
