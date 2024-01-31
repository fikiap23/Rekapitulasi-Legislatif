import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import { LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import userService from 'src/services/userService';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import CreateUserDialog from '../create-user-dialog';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const dummyUsers = [
    {
      _id: '1',
      username: 'john_doe',
      role: 'Admin',
      village_id: { village_name: 'Village A' },
      status: 'Aktif',
    },
    {
      _id: '2',
      username: 'jane_smith',
      role: 'User',
      district_id: { district_name: 'District B' },
      status: 'Aktif',
    },
    {
      _id: '3',
      username: 'sam_wilson',
      role: 'User',
      status: 'Aktif',
    },
    {
      _id: '4',
      username: 'tony_stark',
      role: 'Admin',
      status: 'Nonaktif',
    },
    {
      _id: '5',
      username: 'peter_parker',
      role: 'User',
      village_id: { village_name: 'Village C' },
      status: 'Aktif',
    },
  ];

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('username');
  const [filterUsername, setFilterUsername] = useState(''); // Change to filter by username
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading] = useState(false);
  // const [users, setUsers] = useState([]);
  const [users] = useState(dummyUsers);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByUsername = (event) => {
    setPage(0);
    setFilterUsername(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterUsername,
  });

  const notFound = !dataFiltered.length && !!filterUsername;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
        <CreateUserDialog />
      </Stack>
      {loading && <LinearProgress color="primary" variant="query" />}
      {!loading && (
        <Card>
          <UserTableToolbar
            numSelected={selected.length}
            filterUsername={filterUsername}
            selectedIds={selected}
            onFilterUsername={handleFilterByUsername}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'username', label: 'Username' }, // Change to filter by username
                    { id: 'daerah', label: 'Daerah' },
                    { id: 'role', label: 'Peran' },
                    { id: 'status', label: 'Status' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        user={row}
                        id={row._id}
                        key={row._id}
                        username={row.username} // Change to filter by username
                        role={row.role}
                        status="Aktif"
                        daerah={
                          row.village_id?.village_name ??
                          row.district_id?.district_name ??
                          'Super Admin'
                        }
                        selected={selected.indexOf(row._id) !== -1} // Change to filter by username
                        handleClick={(event) => handleClick(event, row._id)} // Change to filter by username
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, users.length)}
                  />

                  {notFound && <TableNoData query={filterUsername} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
    </Container>
  );
}
