import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Folder,
  Calculate,
  Description,
  TrendingUp,
  Security,
  Family,
  Add,
  MoreVert,
  FilePresent,
  Schedule,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth, useVault } from '../store/hooks';
import MainLayout from '../components/Layout/MainLayout';
import Loading from '../components/Common/Loading';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, folders, isLoading } = useVault();

  const quickActions = [
    {
      title: 'Upload Dokumen',
      description: 'Tambahkan dokumen penting ke vault digital',
      icon: <Add />,
      color: '#4CAF50',
      action: () => navigate('/vault?action=upload'),
    },
    {
      title: 'Hitung Faraid',
      description: 'Gunakan kalkulator pembagian warisan',
      icon: <Calculate />,
      color: '#2196F3',
      action: () => navigate('/faraid'),
    },
    {
      title: 'Buat Wasiat',
      description: 'Panduan membuat wasiat sesuai syariat',
      icon: <Description />,
      color: '#FF9800',
      action: () => navigate('/will'),
    },
    {
      title: 'Kelola Keluarga',
      description: 'Atur informasi anggota keluarga',
      icon: <Family />,
      color: '#9C27B0',
      action: () => navigate('/family'),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'upload',
      title: 'Dokumen Sertifikat Tanah',
      description: 'Diunggah ke folder Properti',
      time: '2 jam yang lalu',
      icon: <FilePresent />,
      status: 'completed',
    },
    {
      id: 2,
      type: 'calculation',
      title: 'Perhitungan Faraid',
      description: 'Untuk harta senilai Rp 500.000.000',
      time: '1 hari yang lalu',
      icon: <Calculate />,
      status: 'completed',
    },
    {
      id: 3,
      type: 'will',
      title: 'Draft Wasiat',
      description: 'Perlu ditinjau dan diselesaikan',
      time: '3 hari yang lalu',
      icon: <Description />,
      status: 'pending',
    },
  ];

  const stats = [
    {
      title: 'Total Dokumen',
      value: items?.length || 0,
      icon: <Folder />,
      color: '#4CAF50',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Folder Aktif',
      value: folders?.length || 0,
      icon: <Security />,
      color: '#2196F3',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Perhitungan Faraid',
      value: 3,
      icon: <Calculate />,
      color: '#FF9800',
      change: '+2',
      changeType: 'increase',
    },
    {
      title: 'Tingkat Keamanan',
      value: '95%',
      icon: <Security />,
      color: '#9C27B0',
      change: '+3%',
      changeType: 'increase',
    },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <Loading variant="page" text="Memuat dashboard..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '1.5rem',
                }}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Selamat datang, {user?.firstName || 'User'}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Kelola warisan dan amanah Anda dengan mudah dan aman
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
                onClick={() => navigate('/profile')}
              >
                Lihat Profil
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stat.value}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <TrendingUp
                          sx={{
                            fontSize: 16,
                            color: stat.changeType === 'increase' ? 'success.main' : 'error.main',
                            mr: 0.5,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={stat.changeType === 'increase' ? 'success.main' : 'error.main'}
                        >
                          {stat.change}
                        </Typography>
                      </Box>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Aksi Cepat</Typography>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 2,
                          },
                        }}
                        onClick={action.action}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar
                              sx={{
                                bgcolor: action.color,
                                width: 40,
                                height: 40,
                                mr: 2,
                              }}
                            >
                              {action.icon}
                            </Avatar>
                            <Typography variant="h6">{action.title}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Aktivitas Terbaru
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: activity.status === 'completed' ? 'success.main' : 'warning.main',
                            }}
                          >
                            {activity.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="body2" fontWeight={600}>
                                {activity.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={activity.status === 'completed' ? 'Selesai' : 'Pending'}
                                color={activity.status === 'completed' ? 'success' : 'warning'}
                                icon={activity.status === 'completed' ? <CheckCircle /> : <Warning />}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                <Schedule sx={{ fontSize: 12, mr: 0.5 }} />
                                {activity.time}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/activities')}
                >
                  Lihat Semua Aktivitas
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Security Status */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status Keamanan Akun
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Tingkat Keamanan</Typography>
                    <Typography variant="body2" fontWeight={600}>95%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: 'success.main',
                      },
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Akun Anda sangat aman. Pastikan untuk selalu menggunakan password yang kuat
                  dan aktifkan autentikasi dua faktor.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/security')}
                >
                  Kelola Keamanan
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;