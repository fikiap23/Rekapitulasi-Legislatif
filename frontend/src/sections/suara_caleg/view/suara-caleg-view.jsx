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

import { users } from 'src/_mock/user';
import resultService from 'src/services/resultService';
import districtService from 'src/services/districtService';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
// ----------------------------------------------------------------------

export default function SuaraCalegView() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState({});
  const [dataParties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);

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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Calon Legislatif</Typography>
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

          <Card>
            <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleSort}
                    headLabel={[
                      { id: 'isVerified', label: 'No', align: 'center' },
                      { id: 'name', label: 'Nama' },
                      { id: 'company', label: 'Partai' },
                      { id: 'role', label: 'Jumlah Suara' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <UserTableRow
                          key={row.id}
                          no={page * rowsPerPage + index + 1}
                          name={row.name}
                          role={row.role}
                          company={row.company}
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
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </>
      )}
    </Container>
  );
}
