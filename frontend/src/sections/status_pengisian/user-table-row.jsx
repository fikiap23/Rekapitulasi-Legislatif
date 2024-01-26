import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import resultService from 'src/services/resultService';

import Label from 'src/components/label';

import DetailHistory from '../pengisian_suara/detail-history-dialog';

// ----------------------------------------------------------------------

export default function UserTableRow({ village_name, district_name, status, no, village_id }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getHistory = async () => {
      try {
        setLoading(true);
        setHistory([]);
        const fetchHistory = await resultService.getHistoryVillageId(village_id);

        if (fetchHistory.data.history && fetchHistory.data.history.length > 0) {
          const lastHistory = fetchHistory.data.history[fetchHistory.data.history.length - 1];
          // console.log(lastHistory.valid_ballots_detail);
          setHistory(lastHistory.valid_ballots_detail);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    getHistory();
  }, [village_id]);
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
      {status && history && loading === false && (
        <TableCell align="center">
          {' '}
          <DetailHistory parties={history} />
        </TableCell>
      )}
    </TableRow>
  );
}

UserTableRow.propTypes = {
  district_name: PropTypes.any,
  no: PropTypes.any,
  village_name: PropTypes.any,
  village_id: PropTypes.any,
  status: PropTypes.any,
};
