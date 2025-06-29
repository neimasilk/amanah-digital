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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TextareaAutosize,
} from '@mui/material';
import {
  ExpandMore,
  Description,
  Save,
  Print,
  Share,
  Info,
  CheckCircle,
  Warning,
  Gavel,
  Assignment,
  Person,
  Home,
  AttachMoney,
  Security,
  Family,
  Edit,
  Preview,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MainLayout from '../components/Layout/MainLayout';
import Loading from '../components/Common/Loading';
import { useNotification } from '../components/Common/NotificationProvider';

interface WillFormData {
  // Personal Information
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  religion: string;
  maritalStatus: string;
  
  // Executor Information
  executorName: string;
  executorRelationship: string;
  executorContact: string;
  
  // Assets
  realEstate: string;
  bankAccounts: string;
  investments: string;
  personalProperty: string;
  otherAssets: string;
  
  // Beneficiaries
  beneficiaries: string;
  
  // Special Instructions
  funeralWishes: string;
  charitableDonations: string;
  specialInstructions: string;
  
  // Islamic Provisions
  islamicProvisions: boolean;
  faraidCompliance: boolean;
  
  // Witnesses
  witness1Name: string;
  witness1Contact: string;
  witness2Name: string;
  witness2Contact: string;
}

const schema = yup.object({
  fullName: yup.string().required('Nama lengkap wajib diisi'),
  idNumber: yup.string().required('Nomor identitas wajib diisi'),
  dateOfBirth: yup.string().required('Tanggal lahir wajib diisi'),
  address: yup.string().required('Alamat wajib diisi'),
  executorName: yup.string().required('Nama pelaksana wasiat wajib diisi'),
  executorRelationship: yup.string().required('Hubungan dengan pelaksana wajib diisi'),
});

const steps = [
  'Informasi Pribadi',
  'Pelaksana Wasiat',
  'Inventaris Harta',
  'Penerima Wasiat',
  'Ketentuan Khusus',
  'Saksi & Finalisasi',
];

const willTemplates = [
  {
    id: 'basic',
    title: 'Wasiat Dasar',
    description: 'Template sederhana untuk wasiat umum',
    icon: <Description />,
  },
  {
    id: 'islamic',
    title: 'Wasiat Islami',
    description: 'Template sesuai dengan hukum Islam',
    icon: <Gavel />,
  },
  {
    id: 'business',
    title: 'Wasiat Bisnis',
    description: 'Template untuk pemilik usaha',
    icon: <Assignment />,
  },
];

const islamicGuidelines = [
  {
    title: 'Batasan Wasiat dalam Islam',
    content: 'Wasiat dalam Islam dibatasi maksimal 1/3 dari total harta setelah dikurangi hutang dan biaya pemakaman.',
  },
  {
    title: 'Prioritas Pembayaran',
    content: 'Urutan: 1) Biaya pemakaman, 2) Hutang, 3) Wasiat (maks 1/3), 4) Warisan (2/3 sisanya).',
  },
  {
    title: 'Penerima Wasiat',
    content: 'Wasiat tidak boleh diberikan kepada ahli waris kecuali ada persetujuan dari ahli waris lainnya.',
  },
  {
    title: 'Saksi',
    content: 'Diperlukan minimal 2 orang saksi yang adil dan beragama Islam.',
  },
];

const WillGuide: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedTemplate, setSelectedTemplate] = React.useState('');
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedWill, setGeneratedWill] = React.useState('');
  const { showSuccess, showError, showInfo } = useNotification();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WillFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      dateOfBirth: '',
      placeOfBirth: '',
      address: '',
      religion: 'Islam',
      maritalStatus: '',
      executorName: '',
      executorRelationship: '',
      executorContact: '',
      realEstate: '',
      bankAccounts: '',
      investments: '',
      personalProperty: '',
      otherAssets: '',
      beneficiaries: '',
      funeralWishes: '',
      charitableDonations: '',
      specialInstructions: '',
      islamicProvisions: true,
      faraidCompliance: true,
      witness1Name: '',
      witness1Contact: '',
      witness2Name: '',
      witness2Contact: '',
    },
  });

  const watchedValues = watch();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const generateWill = async (data: WillFormData) => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const willDocument = `
SURAT WASIAT

Bismillahirrahmanirrahim

Yang bertanda tangan di bawah ini:
Nama Lengkap: ${data.fullName}
Nomor Identitas: ${data.idNumber}
Tanggal Lahir: ${data.dateOfBirth}
Tempat Lahir: ${data.placeOfBirth}
Alamat: ${data.address}
Agama: ${data.religion}
Status Perkawinan: ${data.maritalStatus}

Dengan penuh kesadaran dan dalam keadaan sehat jasmani dan rohani, dengan ini menyatakan wasiat sebagai berikut:

1. PELAKSANA WASIAT
Saya menunjuk ${data.executorName} (${data.executorRelationship}) sebagai pelaksana wasiat ini.
Kontak: ${data.executorContact}

2. INVENTARIS HARTA
${data.realEstate ? `Properti: ${data.realEstate}\n` : ''}
${data.bankAccounts ? `Rekening Bank: ${data.bankAccounts}\n` : ''}
${data.investments ? `Investasi: ${data.investments}\n` : ''}
${data.personalProperty ? `Harta Pribadi: ${data.personalProperty}\n` : ''}
${data.otherAssets ? `Aset Lainnya: ${data.otherAssets}\n` : ''}

3. PENERIMA WASIAT
${data.beneficiaries}

4. KETENTUAN KHUSUS
${data.funeralWishes ? `Keinginan Pemakaman: ${data.funeralWishes}\n` : ''}
${data.charitableDonations ? `Donasi Amal: ${data.charitableDonations}\n` : ''}
${data.specialInstructions ? `Instruksi Khusus: ${data.specialInstructions}\n` : ''}

5. KETENTUAN ISLAM
${data.islamicProvisions ? 'Wasiat ini dibuat sesuai dengan ketentuan hukum Islam.\n' : ''}
${data.faraidCompliance ? 'Pembagian warisan mengikuti ketentuan Faraid.\n' : ''}

Demikian wasiat ini saya buat dengan penuh kesadaran dan tanpa paksaan dari pihak manapun.

Tanggal: ${new Date().toLocaleDateString('id-ID')}

Pembuat Wasiat,


${data.fullName}

Saksi 1:
Nama: ${data.witness1Name}
Kontak: ${data.witness1Contact}
Tanda Tangan: _______________

Saksi 2:
Nama: ${data.witness2Name}
Kontak: ${data.witness2Contact}
Tanda Tangan: _______________
      `;
      
      setGeneratedWill(willDocument);
      setPreviewOpen(true);
      showSuccess('Wasiat berhasil dibuat!');
    } catch (error) {
      showError('Gagal membuat wasiat');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWill = () => {
    showSuccess('Wasiat berhasil disimpan');
    setSaveDialogOpen(false);
  };

  const handlePrintWill = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Surat Wasiat</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { text-align: center; margin-bottom: 30px; }
              .content { white-space: pre-line; }
            </style>
          </head>
          <body>
            <div class="content">${generatedWill}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Masukkan informasi pribadi Anda dengan lengkap dan akurat.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nama Lengkap"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="idNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nomor Identitas (KTP/Paspor)"
                    error={!!errors.idNumber}
                    helperText={errors.idNumber?.message}
                  />
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
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Alamat Lengkap"
                    multiline
                    rows={3}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="religion"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Agama</InputLabel>
                    <Select {...field} label="Agama">
                      <MenuItem value="Islam">Islam</MenuItem>
                      <MenuItem value="Kristen">Kristen</MenuItem>
                      <MenuItem value="Katolik">Katolik</MenuItem>
                      <MenuItem value="Hindu">Hindu</MenuItem>
                      <MenuItem value="Buddha">Buddha</MenuItem>
                      <MenuItem value="Konghucu">Konghucu</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status Perkawinan</InputLabel>
                    <Select {...field} label="Status Perkawinan">
                      <MenuItem value="Belum Menikah">Belum Menikah</MenuItem>
                      <MenuItem value="Menikah">Menikah</MenuItem>
                      <MenuItem value="Cerai">Cerai</MenuItem>
                      <MenuItem value="Janda/Duda">Janda/Duda</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Pilih seseorang yang Anda percaya untuk melaksanakan wasiat Anda.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="executorName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nama Pelaksana Wasiat"
                    error={!!errors.executorName}
                    helperText={errors.executorName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="executorRelationship"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Hubungan dengan Anda"
                    error={!!errors.executorRelationship}
                    helperText={errors.executorRelationship?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="executorContact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Kontak Pelaksana (Telepon/Email/Alamat)"
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Daftarkan semua harta yang Anda miliki secara detail.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="realEstate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Properti (Rumah, Tanah, dll)"
                    multiline
                    rows={3}
                    placeholder="Contoh: Rumah di Jl. Merdeka No. 123, Jakarta (SHM No. 456)"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="bankAccounts"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Rekening Bank"
                    multiline
                    rows={3}
                    placeholder="Contoh: BCA No. 1234567890, BNI No. 0987654321"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="investments"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Investasi (Saham, Obligasi, Reksadana, dll)"
                    multiline
                    rows={3}
                    placeholder="Contoh: Saham BBCA 1000 lembar, Reksadana XYZ"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="personalProperty"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Harta Pribadi (Kendaraan, Perhiasan, dll)"
                    multiline
                    rows={3}
                    placeholder="Contoh: Mobil Honda Civic 2020 (B 1234 ABC), Perhiasan emas"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="otherAssets"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Aset Lainnya"
                    multiline
                    rows={3}
                    placeholder="Contoh: Bisnis, piutang, koleksi seni, dll"
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Penting:</strong> Dalam Islam, wasiat dibatasi maksimal 1/3 dari harta bersih dan tidak boleh diberikan kepada ahli waris kecuali ada persetujuan ahli waris lainnya.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="beneficiaries"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Penerima Wasiat"
                    multiline
                    rows={6}
                    placeholder={`Contoh:
1. Yayasan Yatim Piatu Al-Ikhlas - 20% dari wasiat untuk program pendidikan
2. Masjid Al-Hidayah - 10% dari wasiat untuk renovasi
3. Saudara Ahmad bin Usman - Rumah di Jl. Kebon Jeruk (bukan ahli waris)

Catatan: Sebutkan nama lengkap, hubungan, dan bagian yang diberikan`}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="funeralWishes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Keinginan Pemakaman"
                    multiline
                    rows={3}
                    placeholder="Contoh: Dimakamkan di TPU Tanah Kusir, menggunakan kain kafan putih sederhana"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="charitableDonations"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Donasi Amal"
                    multiline
                    rows={3}
                    placeholder="Contoh: Donasi rutin Rp 500.000/bulan ke panti asuhan selama 2 tahun"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="specialInstructions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Instruksi Khusus"
                    multiline
                    rows={4}
                    placeholder="Contoh: Koleksi buku agama diberikan ke perpustakaan masjid, komputer untuk anak yatim"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="islamicProvisions"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value} />
                    )}
                  />
                }
                label="Wasiat ini dibuat sesuai dengan ketentuan hukum Islam"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="faraidCompliance"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value} />
                    )}
                  />
                }
                label="Pembagian warisan (2/3 sisanya) mengikuti ketentuan Faraid"
              />
            </Grid>
          </Grid>
        );

      case 5:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Diperlukan minimal 2 orang saksi yang adil dan beragama Islam.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="witness1Name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nama Saksi 1"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="witness1Contact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Kontak Saksi 1"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="witness2Name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nama Saksi 2"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="witness2Contact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Kontak Saksi 2"
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Box>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Panduan Pembuatan Wasiat
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Buat wasiat Anda sesuai dengan ketentuan hukum Islam
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Template Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom>
                Template Wasiat
              </Typography>
              <Grid container spacing={2}>
                {willTemplates.map((template) => (
                  <Grid item xs={12} key={template.id}>
                    <Card
                      variant={selectedTemplate === template.id ? 'elevation' : 'outlined'}
                      sx={{
                        cursor: 'pointer',
                        border: selectedTemplate === template.id ? 2 : 1,
                        borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                      }}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          {template.icon}
                          <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            {template.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {template.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Panduan Islam
              </Typography>
              {islamicGuidelines.map((guideline, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">
                      {guideline.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {guideline.content}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          {/* Main Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box component="form" onSubmit={handleSubmit(generateWill)}>
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
                      type="submit"
                      variant="contained"
                      disabled={isGenerating}
                      startIcon={isGenerating ? <Loading variant="circular" size="small" /> : <Description />}
                    >
                      {isGenerating ? 'Membuat Wasiat...' : 'Buat Wasiat'}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} variant="contained">
                      Lanjut
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Preview Wasiat</Typography>
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
                  onClick={handlePrintWill}
                >
                  Cetak
                </Button>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {generatedWill}
              </Typography>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Tutup</Button>
          </DialogActions>
        </Dialog>

        {/* Save Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Simpan Wasiat</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nama Dokumen"
              fullWidth
              variant="outlined"
              placeholder="Contoh: Wasiat Ahmad bin Usman 2024"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveWill} variant="contained">
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default WillGuide;