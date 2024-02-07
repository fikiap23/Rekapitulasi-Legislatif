import { useState } from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from 'src/components/scrollbar';

import UserTableRow from './user-table-row';
import UserTableHead from './user-table-head';
import { applyFilter, getComparator } from './utils';

export default function CalegTable({ calegs }) {
  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

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
  );
}

CalegTable.propTypes = {
  calegs: PropTypes.array,
};
