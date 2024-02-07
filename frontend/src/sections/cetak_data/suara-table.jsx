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

export default function SuaraTable({ data, name }) {
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
                  {
                    id:
                      name === 'Kecamatan'
                        ? 'district_name'
                        : name === 'Kelurahan'
                        ? 'village_name'
                        : 'number',
                    label: name,
                  },
                  { id: 'total_voters', label: 'Total Hak Suara' },
                  { id: 'total_valid_ballots', label: 'Suara Sah' },
                  { id: 'total_invalid_ballots', label: 'Suara Tidak Sah' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row, index) => (
                  <TableRow hover tabIndex={-1} role="checkbox">
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{row.district_name ?? row.village_name ?? row.number}</TableCell>
                    <TableCell>{row.total_voters}</TableCell>
                    <TableCell>{row.total_valid_ballots}</TableCell>
                    <TableCell>{row.total_invalid_ballots}</TableCell>
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

SuaraTable.propTypes = {
  data: PropTypes.array,
  name: PropTypes.string,
};
