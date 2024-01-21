import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'pengisian suara',
    path: '/pengisian-suara',
    icon: <Iconify icon="radix-icons:pencil-2" />,
    accessibleRoles: ['admin', 'user_district', 'user_village'],
  },
  {
    title: 'data keseluruhan',
    path: '/',
    icon: <Iconify icon="tdesign:chart-analytics" />,
    accessibleRoles: ['admin'],
  },
  {
    title: 'data kecamatan',
    path: '/kecamatan',
    icon: <Iconify icon="teenyicons:building-outline" />,
    accessibleRoles: ['admin', 'user_district'],
  },
  {
    title: 'data kelurahan',
    path: '/kelurahan',
    icon: <Iconify icon="healthicons:village-outline" />,
    accessibleRoles: ['admin'],
  },
  {
    title: 'data suara caleg',
    path: '/suara-caleg',
    icon: <Iconify icon="healthicons:village-outline" />,
    accessibleRoles: ['admin'],
  },
  {
    title: 'pengguna',
    path: '/user',
    icon: <Iconify icon="solar:user-outline" />,
    accessibleRoles: ['admin'],
  },
];

export default navConfig;
