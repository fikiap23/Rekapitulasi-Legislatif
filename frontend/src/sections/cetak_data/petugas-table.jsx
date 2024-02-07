import { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Grid, TableRow, TableCell } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from 'src/components/scrollbar';

import UserTableHead from './user-table-head';
import { applyFilter, getComparator } from './utils';

export default function PetugasTable({ petugasList }) {
  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const dummyPetugasList = [
    {
      id: 1,
      no: 1,
      district_name: 'Kab. Tangerang',
      village_name: 'Tangerang',
      tps_number: 1,
      username: 'tps2',
    },
    {
      id: 2,
      no: 2,
      district_name: 'Kab. Tangerang',
      village_name: 'Tangerang',
      tps_number: 1,
      username: 'tps3',
    },
  ];
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: dummyPetugasList,
    comparator: getComparator(order, orderBy),
  });
  return (
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
                  { id: 'no', label: 'No', align: 'center' },
                  { id: 'district_name', label: 'District' },
                  { id: 'village_name', label: 'Village' },
                  { id: 'tps_number', label: 'TPS Number' },
                  { id: 'username', label: 'Username' },
                  { id: 'password', label: 'Password' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row, index) => (
                  <TableRow hover tabIndex={-1} role="checkbox">
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{row.district_name}</TableCell>
                    <TableCell>{row.village_name}</TableCell>
                    <TableCell>{row.tps_number}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.password}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

PetugasTable.propTypes = {
  petugasList: PropTypes.array,
};
