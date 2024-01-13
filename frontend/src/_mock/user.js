import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const users = [...Array(25)].map((_, index) => ({
  id: faker.string.uuid(),
  username: faker.name.fullName(),
  daerah: faker.address.city(),
  status: sample(['aktif', 'tidak aktif']),
  role: sample(['Admin', 'Petugas kelurahan']),
}));
