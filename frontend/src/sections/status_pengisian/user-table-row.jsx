import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function UserTableRow({ village_name, district_name, status, no }) {
  return (
    <TableRow hover tabIndex={-1} status="checkbox">
      <TableCell align="center">{no}</TableCell>
      <TableCell>{village_name}</TableCell>

      <TableCell>{district_name}</TableCell>

      <TableCell>
        <Label color={status ? 'success' : 'error'}>
          {status ? 'Sudah Mengisi' : 'Belum Mengisi'}
        </Label>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  district_name: PropTypes.any,
  no: PropTypes.any,
  village_name: PropTypes.any,
  status: PropTypes.any,
};
