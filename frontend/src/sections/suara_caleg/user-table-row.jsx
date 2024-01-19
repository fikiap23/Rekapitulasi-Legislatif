import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export default function UserTableRow({ name, company, role, isVerified }) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell>{name}</TableCell>

      <TableCell>{company}</TableCell>

      <TableCell>{role}</TableCell>

      <TableCell align="center">{isVerified ? 'Yes' : 'No'}</TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  company: PropTypes.any,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
};
