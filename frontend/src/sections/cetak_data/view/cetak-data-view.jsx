import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Grid, Button, MenuItem, TextField, LinearProgress } from '@mui/material';

import rekapService from 'src/services/rekapService';
import districtService from 'src/services/districtService';

import Iconify from 'src/components/iconify/iconify';

import CalegTable from '../caleg-table';
import PartyTable from '../partai-table';

// ----------------------------------------------------------------------

export default function CetakDataView() {
  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [cetakDataType, setCetakDataType] = useState('');
  const [calegs, setCalegs] = useState([]);
  const [parties, setParties] = useState([]);
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

  const handleResetData = () => {
    setKecamatan('');
    setKelurahan('');
    setCetakDataType('');
    setCalegs([]);
    setGridSize({
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
  };

  useEffect(() => {
    const handleGetAllKecamatan = async () => {
      try {
        if (kecamatans.length === 0) {
          setLoading(true);

          const getKecamatans = await districtService.getAllDistricts();
          setKecamatans(getKecamatans.data);
          setLoading(false);
        }
      } catch (error) {
        setKecamatans([]);
        setLoading(false);
      }
    };
    handleGetAllKecamatan();
  }, [kecamatans]);
  useEffect(() => {
    const handleGetCaleg = async () => {
      try {
        if (cetakDataType === 'data-caleg') {
          setLoading(true);
          if (kelurahan) {
            handleGetCalegKelurahan(kelurahan._id);
          } else if (kecamatan) {
            handleCalegByKecamatan(kecamatan._id);
          } else {
            handleGetAllCaleg();
          }
        } else if (cetakDataType === 'data-partai') {
          setLoading(true);

          if (kelurahan) {
            // handlePartiesBallotByVillageId(kelurahan._id);
          } else if (kecamatan) {
            handlePartiesBallotByDistrictId(kecamatan._id);
          } else {
            handleGetAllPartiesBallot();
          }
        }
      } catch (error) {
        setLoading(false);
        setCalegs([]);
      }
    };
    handleGetCaleg();
  }, [cetakDataType, kecamatan, kelurahan]);

  const handleGetAllPartiesBallot = async () => {
    try {
      setLoading(true);
      const getParties = await rekapService.getAllRekapBallots();
      // console.log(getParties.data);
      setParties(getParties.data.valid_ballots_detail);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePartiesBallotByDistrictId = async (districtId) => {
    try {
      setLoading(true);
      const getParties = await rekapService.getAllRekapBallotsByDistrictId(districtId);
      // console.log(getParties.data);
      setParties(getParties.data.valid_ballots_detail);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleGetAllCaleg = async () => {
    try {
      setKelurahan('');
      setLoading(true);
      const getCalegs = await rekapService.getAllCalegVotes();
      setCalegs(getCalegs.data);

      setLoading(false);
    } catch (error) {
      setKelurahan('');
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

  const handleGetCalegKelurahan = async (village_id) => {
    try {
      setLoading(true);

      const getCalegs = await rekapService.getAllCalegVotesInVillage(village_id);
      setCalegs(getCalegs.data);

      setLoading(false);
    } catch (error) {
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
                  handleResetData();
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
                disabled={!cetakDataType}
                value={kecamatan}
                onChange={(e) => {
                  setKelurahan('');
                  setKecamatan(e.target.value);
                  setKelurahans(e.target.value.villages);
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
          {cetakDataType === 'data-caleg' && <CalegTable calegs={calegs} />}
          {cetakDataType === 'data-partai' && <PartyTable parties={parties} />}
        </>
      )}
    </Container>
  );
}
