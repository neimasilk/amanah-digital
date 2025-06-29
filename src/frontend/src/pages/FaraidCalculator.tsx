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
  Stepper,
  Step,
  StepLabel,
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Calculate,
  Add,
  Remove,
  Save,
  Print,
  Share,
  Info,
  Person,
  AttachMoney,
  Family,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MainLayout from '../components/Layout/MainLayout';
import Loading from '../components/Common/Loading';
import { useNotification } from '../components/Common/NotificationProvider';

interface Heir {
  id: string;
  name: string;
  relationship: string;
  gender: 'male' | 'female';
  isAlive: boolean;
}

interface Asset {
  id: string;
  name: string;
  value: number;
  type: string;
}

interface FaraidFormData {
  deceasedName: string;
  deceasedGender: 'male' | 'female';
  totalAssets: number;
  debts: number;
  funeralExpenses: number;
  heirs: Heir[];
  assets: Asset[];
}

const schema = yup.object({
  deceasedName: yup.string().required('Nama almarhum/almarhumah wajib diisi'),
  deceasedGender: yup.string().required('Jenis kelamin wajib dipilih'),
  totalAssets: yup.number().min(0, 'Total harta harus positif').required('Total harta wajib diisi'),
  debts: yup.number().min(0, 'Hutang harus positif'),
  funeralExpenses: yup.number().min(0, 'Biaya pemakaman harus positif'),
});

const relationshipOptions = [
  { value: 'spouse', label: 'Suami/Istri' },
  { value: 'father', label: 'Ayah' },
  { value: 'mother', label: 'Ibu' },
  { value: 'son', label: 'Anak Laki-laki' },
  { value: 'daughter', label: 'Anak Perempuan' },
  { value: 'brother', label: 'Saudara Laki-laki' },
  { value: 'sister', label: 'Saudara Perempuan' },
  { value: 'grandfather', label: 'Kakek' },
  { value: 'grandmother', label: 'Nenek' },
  { value: 'grandson', label: 'Cucu Laki-laki' },
  { value: 'granddaughter', label: 'Cucu Perempuan' },
];

const steps = [
  'Informasi Almarhum',
  'Data Ahli Waris',
  'Rincian Harta',
  'Hasil Perhitungan',
];

const FaraidCalculator: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [calculationResult, setCalculationResult] = React.useState<any>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const { showSuccess, showError, showInfo } = useNotification();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FaraidFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      deceasedName: '',
      deceasedGender: 'male',
      totalAssets: 0,
      debts: 0,
      funeralExpenses: 0,
      heirs: [],
      assets: [],
    },
  });

  const {
    fields: heirFields,
    append: appendHeir,
    remove: removeHeir,
  } = useFieldArray({
    control,
    name: 'heirs',
  });

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({
    control,
    name: 'assets',
  });

  const watchedValues = watch();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddHeir = () => {
    appendHeir({
      id: Date.now().toString(),
      name: '',
      relationship: '',
      gender: 'male',
      isAlive: true,
    });
  };

  const handleAddAsset = () => {
    appendAsset({
      id: Date.now().toString(),
      name: '',
      value: 0,
      type: '',
    });
  };

  const calculateFaraid = async (data: FaraidFormData) => {
    setIsCalculating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock calculation result
      const netAssets = data.totalAssets - data.debts - data.funeralExpenses;
      const result = {
        netAssets,
        distribution: data.heirs.map((heir, index) => ({
          ...heir,
          share: Math.random() * 0.3 + 0.1, // Mock share percentage
          amount: (Math.random() * 0.3 + 0.1) * netAssets,
        })),
        summary: {
          totalDistributed: netAssets * 0.9,
          remaining: netAssets * 0.1,
        },
      };
      
      setCalculationResult(result);
      setActiveStep(3);
      showSuccess('Perhitungan Faraid berhasil!');
    } catch (error) {
      showError('Gagal melakukan perhitungan');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveCalculation = () => {
    showSuccess('Perhitungan berhasil disimpan');
    setSaveDialogOpen(false);
  };

  const handlePrintResult = () => {
    window.print();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Masukkan informasi dasar tentang almarhum/almarhumah untuk memulai perhitungan Faraid.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="deceasedName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nama Almarhum/Almarhumah"
                    error={!!errors.deceasedName}
                    helperText={errors.deceasedName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="deceasedGender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.deceasedGender}>
                    <InputLabel>Jenis Kelamin</InputLabel>
                    <Select {...field} label="Jenis Kelamin">
                      <MenuItem value="male">Laki-laki</MenuItem>
                      <MenuItem value="female">Perempuan</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="totalAssets"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Total Harta (Rp)"
                    type="number"
                    error={!!errors.totalAssets}
                    helperText={errors.totalAssets?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="debts"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Total Hutang (Rp)"
                    type="number"
                    error={!!errors.debts}
                    helperText={errors.debts?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="funeralExpenses"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Biaya Pemakaman (Rp)"
                    type="number"
                    error={!!errors.funeralExpenses}
                    helperText={errors.funeralExpenses?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Daftar Ahli Waris</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddHeir}
              >
                Tambah Ahli Waris
              </Button>
            </Box>
            {heirFields.length === 0 ? (
              <Alert severity="warning">
                Belum ada ahli waris yang ditambahkan. Klik "Tambah Ahli Waris" untuk memulai.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {heirFields.map((field, index) => (
                  <Grid item xs={12} key={field.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1">Ahli Waris {index + 1}</Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeHeir(index)}
                          >
                            <Remove />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Controller
                              name={`heirs.${index}.name`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="Nama"
                                  size="small"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Controller
                              name={`heirs.${index}.relationship`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth size="small">
                                  <InputLabel>Hubungan</InputLabel>
                                  <Select {...field} label="Hubungan">
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
                          <Grid item xs={12} md={3}>
                            <Controller
                              name={`heirs.${index}.gender`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth size="small">
                                  <InputLabel>Jenis Kelamin</InputLabel>
                                  <Select {...field} label="Jenis Kelamin">
                                    <MenuItem value="male">Laki-laki</MenuItem>
                                    <MenuItem value="female">Perempuan</MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Controller
                              name={`heirs.${index}.isAlive`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth size="small">
                                  <InputLabel>Status</InputLabel>
                                  <Select {...field} label="Status">
                                    <MenuItem value={true}>Masih Hidup</MenuItem>
                                    <MenuItem value={false}>Meninggal</MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Rincian Harta</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddAsset}
              >
                Tambah Aset
              </Button>
            </Box>
            
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Rp {watchedValues.totalAssets?.toLocaleString('id-ID') || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Harta
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="error" gutterBottom>
                      Rp {((watchedValues.debts || 0) + (watchedValues.funeralExpenses || 0)).toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Kewajiban
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Rp {((watchedValues.totalAssets || 0) - (watchedValues.debts || 0) - (watchedValues.funeralExpenses || 0)).toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Harta Bersih
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {assetFields.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama Aset</TableCell>
                      <TableCell>Jenis</TableCell>
                      <TableCell align="right">Nilai (Rp)</TableCell>
                      <TableCell align="center">Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assetFields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            name={`assets.${index}.name`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                placeholder="Nama aset"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`assets.${index}.type`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                placeholder="Jenis aset"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`assets.${index}.value`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                placeholder="0"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => removeAsset(index)}
                          >
                            <Remove />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        );

      case 3:
        return calculationResult ? (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Hasil Perhitungan Faraid</Typography>
              <Box>
                <Button
                  startIcon={<Save />}
                  onClick={() => setSaveDialogOpen(true)}
                  sx={{ mr: 1 }}
                >
                  Simpan
                </Button>
                <Button
                  startIcon={<Print />}
                  onClick={handlePrintResult}
                  sx={{ mr: 1 }}
                >
                  Cetak
                </Button>
                <Button startIcon={<Share />}>
                  Bagikan
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Rp {calculationResult.netAssets.toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Harta Bersih yang Dibagi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {calculationResult.distribution.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Jumlah Ahli Waris
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="warning.main" gutterBottom>
                      Rp {calculationResult.summary.remaining.toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sisa Harta
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama Ahli Waris</TableCell>
                    <TableCell>Hubungan</TableCell>
                    <TableCell align="center">Bagian (%)</TableCell>
                    <TableCell align="right">Jumlah (Rp)</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calculationResult.distribution.map((heir: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Person sx={{ mr: 1, color: 'text.secondary' }} />
                          {heir.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={relationshipOptions.find(r => r.value === heir.relationship)?.label || heir.relationship}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>
                          {(heir.share * 100).toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="primary">
                          Rp {heir.amount.toLocaleString('id-ID')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<CheckCircle />}
                          label="Valid"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Catatan:</strong> Perhitungan ini berdasarkan hukum waris Islam (Faraid) dan
                dapat digunakan sebagai panduan. Untuk kepastian hukum, disarankan untuk
                berkonsultasi dengan ahli hukum Islam atau notaris.
              </Typography>
            </Alert>
          </Box>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Box>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Kalkulator Faraid
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hitung pembagian warisan sesuai dengan hukum Islam
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit(calculateFaraid)}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Kembali
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(0)}
                >
                  Hitung Ulang
                </Button>
              ) : activeStep === steps.length - 2 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isCalculating}
                  startIcon={isCalculating ? <Loading variant="circular" size="small" /> : <Calculate />}
                >
                  {isCalculating ? 'Menghitung...' : 'Hitung Faraid'}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Lanjut
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Save Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Simpan Perhitungan</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nama Perhitungan"
              fullWidth
              variant="outlined"
              placeholder="Contoh: Perhitungan Faraid Bapak Ahmad"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveCalculation} variant="contained">
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default FaraidCalculator;