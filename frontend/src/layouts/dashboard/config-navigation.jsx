import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'pengisian suara',
    path: '/pengisian-suara',
    icon: <Iconify icon="radix-icons:pencil-2" />,
  },
  {
    title: 'data keseluruhan',
    path: '/',
    icon: <Iconify icon="tdesign:chart-analytics" />,
  },

  {
    title: 'data kecamatan',
    path: '/kecamatan',
    icon: <Iconify icon="teenyicons:building-outline" />,
  },
  {
    title: 'data kelurahan',
    path: '/kelurahan',
    icon: <Iconify icon="healthicons:village-outline" />,
  },

  {
    title: 'pengguna',
    path: '/user',
    icon: <Iconify icon="solar:user-outline" />,
  },
];

export default navConfig;
