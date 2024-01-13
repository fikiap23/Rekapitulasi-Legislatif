import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import Iconify from 'src/components/iconify';

KecamatanSearch.propTypes = {
  kecamatans: PropTypes.array.isRequired,
  onChange: PropTypes.func, // Add onChange prop
};

export default function KecamatanSearch({ kecamatans, onChange }) {
  const handleKecamatanChange = (event, newValue) => {
    if (onChange) {
      // Call the onChange callback with the selected kecamatan
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      sx={{ width: 280 }}
      autoHighlight
      popupIcon={null}
      slotProps={{
        paper: {
          sx: {
            width: 320,
            [`& .${autocompleteClasses.option}`]: {
              typography: 'body2',
            },
          },
        },
      }}
      options={kecamatans}
      getOptionLabel={(kecamatan) => kecamatan.district_name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={handleKecamatanChange} // Handle the change event
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Cari kecamatan..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
