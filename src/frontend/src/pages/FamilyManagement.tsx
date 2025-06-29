import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Divider,
  Badge,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  Family,
  Phone,
  Email,
  Home,
  Work,
  School,
  MoreVert,
  Visibility,
  Share,
  Download,
  Upload,
  Search,
  FilterList,
  PersonAdd,
  Groups,
  AccountTree,
  Info,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MainLayout from '../components/Layout/MainLayout';
import Loading from '../components/Common/Loading';
import { useNotification } from '../components/Common/NotificationProvider';

interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'male' | 'female';
  religion: string;
  maritalStatus: string;
  occupation: string;
  education: string;
  phone: string;
  email: string;
  address: string;
  idNumber: string;
  isAlive: boolean;
  isHeir: boolean;
  notes: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface FamilyFormData {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'male' | 'female';
  religion: string;
  maritalStatus: string;
  occupation: string;
  education: string;
  phone: string;
  email: string;
  address: string;
  idNumber: string;
  isAlive: boolean;
  isHeir: boolean;
  notes: string;
}

const schema = yup.object({
  firstName: yup.string().required('Nama depan wajib diisi'),
  lastName: yup.string().required('Nama belakang wajib diisi'),
  relationship: yup.string().required('Hubungan keluarga wajib diisi'),
  dateOfBirth: yup.string().required('Tanggal lahir wajib diisi'),
  gender: yup.string().required('Jenis kelamin wajib diisi'),
  phone: yup.string().matches(/^[0-9+\-\s()]+$/, 'Format nomor telepon tidak valid'),
  email: yup.string().email('Format email tidak valid'),
});

const relationshipOptions = [
  { value: 'spouse', label: 'Suami/Istri', category: 'immediate' },
  { value: 'father', label: 'Ayah', category: 'immediate' },
  { value: 'mother', label: 'Ibu', category: 'immediate' },
  { value: 'son', label: 'Anak Laki-laki', category: 'immediate' },
  { value: 'daughter', label: 'Anak Perempuan', category: 'immediate' },
  { value: 'brother', label: 'Saudara Laki-laki', category: 'sibling' },
  { value: 'sister', label: 'Saudara Perempuan', category: 'sibling' },
  { value: 'grandfather', label: 'Kakek', category: 'extended' },
  { value: 'grandmother', label: 'Nenek', category: 'extended' },
  { value: 'uncle', label: 'Paman', category: 'extended' },
  { value: 'aunt', label: 'Bibi', category: 'extended' },
  { value: 'nephew', label: 'Keponakan Laki-laki', category: 'extended' },
  { value: 'niece', label: 'Keponakan Perempuan', category: 'extended' },
  { value: 'grandson', label: 'Cucu Laki-laki', category: 'extended' },
  { value: 'granddaughter', label: 'Cucu Perempuan', category: 'extended' },
  { value: 'cousin', label: 'Sepupu', category: 'extended' },
  { value: 'other', label: 'Lainnya', category: 'other' },
];

const FamilyManagement: React.FC = () => {
  const [familyMembers, setFamilyMembers] = React.useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = React.useState<FamilyMember | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterRelationship, setFilterRelationship] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { showSuccess, showError, showInfo } = useNotification();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FamilyFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      relationship: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: 'male',
      religion: 'Islam',
      maritalStatus: '',
      occupation: '',
      education: '',
      phone: '',
      email: '',
      address: '',
      idNumber: '',
      isAlive: true,
      isHeir: false,
      notes: '',
    },
  });

  // Mock data
  React.useEffect(() => {
    const mockMembers: FamilyMember[] = [
      {
        id: '1',
        firstName: 'Siti',
        lastName: 'Aminah',
        relationship: 'spouse',
        dateOfBirth: '1985-03-15',
        placeOfBirth: 'Jakarta',
        gender: 'female',
        religion: 'Islam',
        maritalStatus: 'Menikah',
        occupation: 'Guru',
        education: 'S1 Pendidikan',
        phone: '+62812345678',
        email: 'siti.aminah@email.com',
        address: 'Jl. Merdeka No. 123, Jakarta',
        idNumber: '3171234567890001',
        isAlive: true,
        isHeir: true,
        notes: 'Istri tercinta',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        firstName: 'Ahmad',
        lastName: 'Fauzi',
        relationship: 'son',
        dateOfBirth: '2010-07-20',
        placeOfBirth: 'Jakarta',
        gender: 'male',
        religion: 'Islam',
        maritalStatus: 'Belum Menikah',
        occupation: 'Pelajar',
        education: 'SMP',
        phone: '+62812345679',
        email: 'ahmad.fauzi@email.com',
        address: 'Jl. Merdeka No. 123, Jakarta',
        idNumber: '3171234567890002',
        isAlive: true,
        isHeir: true,
        notes: 'Anak pertama',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '3',
        firstName: 'Fatimah',
        lastName: 'Zahra',
        relationship: 'daughter',
        dateOfBirth: '2012-12-10',
        placeOfBirth: 'Jakarta',
        gender: 'female',
        religion: 'Islam',
        maritalStatus: 'Belum Menikah',
        occupation: 'Pelajar',
        education: 'SD',
        phone: '',
        email: '',
        address: 'Jl. Merdeka No. 123, Jakarta',
        idNumber: '',
        isAlive: true,
        isHeir: true,
        notes: 'Anak kedua',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];
    setFamilyMembers(mockMembers);
  }, []);

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsEditing(false);
    reset();
    setDialogOpen(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setIsEditing(true);
    reset({
      firstName: member.firstName,
      lastName: member.lastName,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth,
      placeOfBirth: member.placeOfBirth,
      gender: member.gender,
      religion: member.religion,
      maritalStatus: member.maritalStatus,
      occupation: member.occupation,
      education: member.education,
      phone: member.phone,
      email: member.email,
      address: member.address,
      idNumber: member.idNumber,
      isAlive: member.isAlive,
      isHeir: member.isHeir,
      notes: member.notes,
    });
    setDialogOpen(true);
  };

  const handleViewMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setViewDialogOpen(true);
  };

  const handleDeleteMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data: FamilyFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing && selectedMember) {
        // Update existing member
        const updatedMembers = familyMembers.map(member =>
          member.id === selectedMember.id
            ? {
                ...member,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : member
        );
        setFamilyMembers(updatedMembers);
        showSuccess('Data anggota keluarga berhasil diperbarui');
      } else {
        // Add new member
        const newMember: FamilyMember = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setFamilyMembers([...familyMembers, newMember]);
        showSuccess('Anggota keluarga berhasil ditambahkan');
      }
      
      setDialogOpen(false);
      reset();
    } catch (error) {
      showError('Gagal menyimpan data anggota keluarga');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedMembers = familyMembers.filter(member => member.id !== selectedMember.id);
      setFamilyMembers(updatedMembers);
      setDeleteDialogOpen(false);
      showSuccess('Anggota keluarga berhasil dihapus');
    } catch (error) {
      showError('Gagal menghapus anggota keluarga');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = familyMembers.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relationshipOptions.find(r => r.value === member.relationship)?.label.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !filterRelationship || member.relationship === filterRelationship;
    
    return matchesSearch && matchesFilter;
  });

  const getRelationshipLabel = (relationship: string) => {
    return relationshipOptions.find(r => r.value === relationship)?.label || relationship;
  };

  const getRelationshipColor = (relationship: string) => {
    const option = relationshipOptions.find(r => r.value === relationship);
    switch (option?.category) {
      case 'immediate': return 'primary';
      case 'sibling': return 'secondary';
      case 'extended': return 'info';
      default: return 'default';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatistics = () => {
    const total = familyMembers.length;
    const heirs = familyMembers.filter(m => m.isHeir).length;
    const alive = familyMembers.filter(m => m.isAlive).length;
    const immediate = familyMembers.filter(m => {
      const option = relationshipOptions.find(r => r.value === m.relationship);
      return option?.category === 'immediate';
    }).length;
    
    return { total, heirs, alive, immediate };
  };

  const stats = getStatistics();

  const renderMemberCard = (member: FamilyMember) => (
    <Card key={member.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar sx={{ mr: 2, bgcolor: member.gender === 'male' ? 'primary.main' : 'secondary.main' }}>
              <Person />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                {member.firstName} {member.lastName}
                {!member.isAlive && (
                  <Chip
                    label="Almarhum/ah"
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                <Chip
                  label={getRelationshipLabel(member.relationship)}
                  size="small"
                  color={getRelationshipColor(member.relationship) as any}
                />
                {member.isHeir && (
                  <Chip
                    label="Ahli Waris"
                    size="small"
                    color="success"
                    icon={<CheckCircle />}
                  />
                )}
                <Chip
                  label={`${calculateAge(member.dateOfBirth)} tahun`}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {member.occupation} • {member.phone}
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton
              onClick={(e) => {
                setSelectedMember(member);
                setAnchorEl(e.currentTarget);
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderMemberTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell>Hubungan</TableCell>
            <TableCell>Usia</TableCell>
            <TableCell>Kontak</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                    <Person fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {member.firstName} {member.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getRelationshipLabel(member.relationship)}
                  size="small"
                  color={getRelationshipColor(member.relationship) as any}
                />
              </TableCell>
              <TableCell>{calculateAge(member.dateOfBirth)} tahun</TableCell>
              <TableCell>
                <Typography variant="body2">{member.phone}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {member.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Chip
                    label={member.isAlive ? 'Hidup' : 'Meninggal'}
                    size="small"
                    color={member.isAlive ? 'success' : 'error'}
                  />
                  {member.isHeir && (
                    <Chip
                      label="Ahli Waris"
                      size="small"
                      color="info"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Lihat Detail">
                  <IconButton
                    size="small"
                    onClick={() => handleViewMember(member)}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEditMember(member)}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Hapus">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteMember(member)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <MainLayout>
      <Box>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Manajemen Keluarga
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola informasi anggota keluarga dan ahli waris
          </Typography>
        </Box>

        {/* Statistics */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Groups color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" color="primary">
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Anggota
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountTree color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" color="success.main">
                      {stats.heirs}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ahli Waris
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircle color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" color="info.main">
                      {stats.alive}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Masih Hidup
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Family color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" color="warning.main">
                      {stats.immediate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keluarga Inti
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Daftar Anggota Keluarga</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleAddMember}
            >
              Tambah Anggota
            </Button>
          </Box>

          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Cari nama atau hubungan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter Hubungan</InputLabel>
                <Select
                  value={filterRelationship}
                  onChange={(e) => setFilterRelationship(e.target.value)}
                  label="Filter Hubungan"
                >
                  <MenuItem value="">Semua</MenuItem>
                  {relationshipOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Tampilan Kartu" />
            <Tab label="Tampilan Tabel" />
          </Tabs>

          {activeTab === 0 ? (
            <Grid container spacing={2}>
              {filteredMembers.map((member) => (
                <Grid item xs={12} md={6} lg={4} key={member.id}>
                  {renderMemberCard(member)}
                </Grid>
              ))}
            </Grid>
          ) : (
            renderMemberTable()
          )}

          {filteredMembers.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {searchQuery || filterRelationship
                ? 'Tidak ada anggota keluarga yang sesuai dengan filter.'
                : 'Belum ada anggota keluarga yang ditambahkan.'}
            </Alert>
          )}
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {isEditing ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nama Depan"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nama Belakang"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="relationship"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.relationship}>
                        <InputLabel>Hubungan Keluarga</InputLabel>
                        <Select {...field} label="Hubungan Keluarga">
                          {relationshipOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>Jenis Kelamin</InputLabel>
                        <Select {...field} label="Jenis Kelamin">
                          <MenuItem value="male">Laki-laki</MenuItem>
                          <MenuItem value="female">Perempuan</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tanggal Lahir"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="placeOfBirth"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tempat Lahir"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nomor Telepon"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Alamat"
                        multiline
                        rows={2}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="occupation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Pekerjaan"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Pendidikan"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Catatan"
                        multiline
                        rows={3}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <Loading variant="circular" size="small" /> : (isEditing ? 'Perbarui' : 'Tambah')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Detail Anggota Keluarga</DialogTitle>
          <DialogContent>
            {selectedMember && (
              <Box>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                    <Person fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getRelationshipLabel(selectedMember.relationship)}
                    </Typography>
                  </Box>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Tanggal Lahir"
                      secondary={`${selectedMember.dateOfBirth} (${calculateAge(selectedMember.dateOfBirth)} tahun)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Tempat Lahir"
                      secondary={selectedMember.placeOfBirth}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Jenis Kelamin"
                      secondary={selectedMember.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Pekerjaan"
                      secondary={selectedMember.occupation}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Pendidikan"
                      secondary={selectedMember.education}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Kontak"
                      secondary={`${selectedMember.phone} • ${selectedMember.email}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Alamat"
                      secondary={selectedMember.address}
                    />
                  </ListItem>
                  {selectedMember.notes && (
                    <ListItem>
                      <ListItemText
                        primary="Catatan"
                        secondary={selectedMember.notes}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Tutup</Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false);
                if (selectedMember) handleEditMember(selectedMember);
              }}
              variant="contained"
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Hapus Anggota Keluarga</DialogTitle>
          <DialogContent>
            <Typography>
              Apakah Anda yakin ingin menghapus {selectedMember?.firstName} {selectedMember?.lastName} dari daftar keluarga?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <Loading variant="circular" size="small" /> : 'Hapus'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItemComponent
            onClick={() => {
              if (selectedMember) handleViewMember(selectedMember);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText>Lihat Detail</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent
            onClick={() => {
              if (selectedMember) handleEditMember(selectedMember);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon><Edit /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent
            onClick={() => {
              if (selectedMember) handleDeleteMember(selectedMember);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon><Delete /></ListItemIcon>
            <ListItemText>Hapus</ListItemText>
          </MenuItemComponent>
        </Menu>
      </Box>
    </MainLayout>
  );
};

export default FamilyManagement;