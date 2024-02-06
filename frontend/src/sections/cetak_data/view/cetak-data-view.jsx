import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { Grid, Button, MenuItem, TextField, LinearProgress } from '@mui/material';

import rekapService from 'src/services/rekapService';
import districtService from 'src/services/districtService';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify/iconify';

import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import { applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function CetakDataView() {
  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [cetakDataType, setCetakDataType] = useState('');
  const [calegs, setCalegs] = useState([]);
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
      const getCalegs = await rekapService.getAllCalegVotes();
      setKecamatans(getKecamatans.data);
      setCalegs(getCalegs.data);

      setLoading(false);
    } catch (error) {
      setKecamatans([]);
      setLoading(false);
    }
  };

  const handleCalegByKecamatan = async (districtId) => {
    try {
      setKelurahan('');
      setLoading(true);
      const getCalegs = await rekapService.getAllCalegVotesInDistrict(districtId);
      setCalegs(getCalegs.data);

      setLoading(false);
    } catch (error) {
      setKelurahan('');
      setLoading(false);
    }
  };

  const handleSelectedKelurahan = async (village_id) => {
    try {
      setLoading(true);

      const getCalegs = await rekapService.getAllCalegVotesInVillage(village_id);
      setCalegs(getCalegs.data);

      setLoading(false);
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

  const dataFiltered = applyFilter({
    inputData: calegs,
    comparator: getComparator(order, orderBy),
  });

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
        <Typography variant="h4">Cetak Data</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        {kelurahan ? (
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Data di Kelurahan {kelurahan.name}
          </Typography>
        ) : (
          kecamatan && (
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Data di Kecamatan {kecamatan.name}
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
                label="Data Yang Ingin Dicetak"
                value={cetakDataType}
                onChange={(e) => {
                  setCetakDataType(e.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Pilih Data Yang Ingin Dicetak
                </MenuItem>

                <MenuItem value="data-petugas">Data Petugas TPS</MenuItem>
                <MenuItem value="data-partai">Data Partai</MenuItem>
                <MenuItem value="data-caleg">Data Caleg</MenuItem>
                <MenuItem value="data-kecamatan">Data Kecamatan</MenuItem>
                <MenuItem value="data-kelurahan">Data Kelurahan</MenuItem>
                <MenuItem value="data-tps">Data TPS</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} className="printArea">
              <TextField
                fullWidth
                select
                label="Kecamatan"
                value={kecamatan}
                onChange={(e) => {
                  setKecamatan(e.target.value);
                  setKelurahans(e.target.value.villages);
                  handleCalegByKecamatan(e.target.value._id);
                  // console.log(e.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Pilih Kecamatan
                </MenuItem>
                {kecamatans.map((option) => (
                  <MenuItem key={option._id} value={option}>
                    {option.name}
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
                {kelurahans.map((option) => (
                  <MenuItem key={option._id} value={option}>
                    {option.name}
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
              <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                  <Table>
                    <UserTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleSort}
                      headLabel={[
                        { id: 'isVerified', label: 'No', align: 'center' },
                        { id: 'candidate_name', label: 'Nama' },
                        { id: 'party_name', label: 'Partai' },
                        { id: 'number_of_votes', label: 'Jumlah Suara' },
                      ]}
                    />
                    <TableBody>
                      {dataFiltered.map((row, index) => (
                        <UserTableRow
                          key={row.candidate_id}
                          no={index + 1}
                          name={row.candidate_name}
                          role={row.number_of_votes}
                          company={row.party_name}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>
        </>
      )}
    </Container>
  );
}
