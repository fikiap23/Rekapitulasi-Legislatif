// import React, { useState, useEffect } from 'react';

// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import Select from '@mui/material/Select';
// import { InputLabel } from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import TextField from '@mui/material/TextField';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';

// import adminUserService from 'src/services/adminUserService';
// import adminDistrictService from 'src/services/adminDistrictService';

// import Iconify from 'src/components/iconify';

// export default function CreateUserDialog() {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     kecamatan: '',
//     village_id: '',
//   });

//   const [loading, setLoading] = useState(false);

//   const [kecamatans, setKecamatans] = useState([]);
//   const [kelurahans, setKelurahans] = useState([]);

//   useEffect(() => {
//     handleGetKecamatans();
//   }, []);

//   const handleGetKecamatans = async () => {
//     const getKecamatans = await adminDistrictService.getAllDistricts();
//     if (getKecamatans.code === 200) {
//       setKecamatans(getKecamatans.data);
//     } else {
//       setKecamatans([]);
//     }
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSubmit = async () => {
//     // await adminUserService.createNewUser(formData);
//     try {
//       setLoading(true);
//       const result = await adminUserService.createNewUser(formData);
//       if (result.code === 201) {
//         alert('User created successfully!');
//         window.location.reload();

//         handleClose();
//       }
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <Button
//         variant="contained"
//         color="inherit"
//         startIcon={<Iconify icon="eva:plus-fill" />}
//         onClick={handleClickOpen}
//       >
//         New User
//       </Button>
//       <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
//         <DialogTitle>Buat akun baru</DialogTitle>
//         <DialogContent>
//           <TextField
//             onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//             autoFocus
//             margin="dense"
//             id="username"
//             name="username"
//             label="Username"
//             type="text"
//             fullWidth
//             variant="standard"
//           />

//           <TextField
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             margin="dense"
//             id="password"
//             name="password"
//             label="Password"
//             type="password"
//             fullWidth
//             variant="standard"
//           />

//           <div style={{ marginTop: '16px' }}>
//             {' '}
//             {/* Add margin to create space */}
//             <InputLabel id="kecamatan-label">Kecamatan</InputLabel>
//             <Select
//               labelId="kecamatan-label"
//               id="kecamatan"
//               name="kecamatan"
//               value={formData.kecamatan}
//               onChange={(e) => {
//                 setFormData({ ...formData, kecamatan: e.target.value });
//                 // console.log(e.target.value);
//                 setKelurahans(e.target.value.villages);
//               }}
//               fullWidth
//             >
//               {kecamatans.map((kecamatan) => (
//                 <MenuItem key={kecamatan._id} value={kecamatan}>
//                   {kecamatan.district_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </div>

//           <div style={{ marginTop: '16px' }}>
//             {' '}
//             {/* Add margin to create space */}
//             <InputLabel id="kelurahan-label">Kelurahan</InputLabel>
//             <Select
//               disabled={!formData.kecamatan}
//               labelId="kelurahan-label"
//               id="kelurahan"
//               name="kelurahan"
//               value={formData.kelurahan}
//               onChange={(e) => setFormData({ ...formData, village_id: e.target.value })}
//               fullWidth
//             >
//               {kelurahans.map((kelurahan) => (
//                 <MenuItem key={kelurahan._id} value={kelurahan._id}>
//                   {kelurahan.village_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </div>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Batal</Button>
//           <Button onClick={handleSubmit}>{loading ? 'Menyimpan...' : 'Simpan'}</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }
