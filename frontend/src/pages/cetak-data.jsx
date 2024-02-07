import { Helmet } from 'react-helmet-async';

import { CetakDataView } from 'src/sections/cetak_data/view';

// ----------------------------------------------------------------------

export default function CetakDataPage() {
  return (
    <>
      <Helmet>
        <title>Cetak Data | Pemilihan Legislatif </title>
      </Helmet>

      <CetakDataView />
    </>
  );
}
