/* eslint-disable no-nested-ternary */
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

export default function PetugasTable({ data }) {
  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('no');

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: data,
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
                  { id: 'district_name', label: 'Kecamatan' },
                  { id: 'village_name', label: 'Kelurahan' },
                  { id: 'tps_number', label: 'Nomor TPS' },
                  { id: 'username', label: 'Username' },
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
  data: PropTypes.array,
};
