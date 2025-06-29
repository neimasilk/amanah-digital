import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Breadcrumbs,
  Link,
  Fab,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewList,
  ViewModule,
  Add,
  Upload,
  CreateNewFolder,
  MoreVert,
  Folder,
  InsertDriveFile,
  Download,
  Share,
  Delete,
  Edit,
  Star,
  StarBorder,
  NavigateNext,
  Home,
  Sort,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useVault, useCurrentUser } from '../store/hooks';
import {
  fetchVaultItems,
  fetchVaultFolders,
  createVaultFolder,
  deleteVaultItem,
  setCurrentFolder,
  setSearchQuery,
  setSelectedItems,
} from '../store/slices/vaultSlice';
import MainLayout from '../components/Layout/MainLayout';
import Loading from '../components/Common/Loading';
import { useNotification } from '../components/Common/NotificationProvider';

const Vault: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const {
    items,
    folders,
    currentFolder,
    selectedItems,
    searchQuery,
    isLoading,
    error,
  } = useVault();
  const user = useCurrentUser();
  const { showSuccess, showError } = useNotification();

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<null | HTMLElement>(null);
  const [createFolderOpen, setCreateFolderOpen] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchVaultItems(undefined));
    dispatch(fetchVaultFolders(undefined));
  }, [dispatch]);

  React.useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'upload') {
      setUploadDialogOpen(true);
    }
  }, [searchParams]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleFolderClick = (folderId: string) => {
    dispatch(setCurrentFolder(folderId));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await dispatch(createVaultFolder({
        name: newFolderName,
        parentId: currentFolder,
      })).unwrap();
      showSuccess('Folder berhasil dibuat');
      setCreateFolderOpen(false);
      setNewFolderName('');
    } catch (error: any) {
      showError(error.message || 'Gagal membuat folder');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await dispatch(deleteVaultItem(itemId)).unwrap();
      showSuccess('Item berhasil dihapus');
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus item');
    }
  };

  const handleItemSelect = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    dispatch(setSelectedItems(newSelection));
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ id: null, name: 'Vault' }];
    // Add logic to build breadcrumb path based on current folder
    return breadcrumbs;
  };

  const filteredItems = items?.filter(item => {
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return currentFolder ? item.folderId === currentFolder : !item.folderId;
  }) || [];

  const filteredFolders = folders?.filter(folder => {
    if (searchQuery) {
      return folder.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return currentFolder ? folder.parentId === currentFolder : !folder.parentId;
  }) || [];

  if (isLoading) {
    return (
      <MainLayout>
        <Loading variant="page" text="Memuat vault..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Digital Vault
            </Typography>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
              {getBreadcrumbs().map((crumb, index) => (
                <Link
                  key={index}
                  color={index === getBreadcrumbs().length - 1 ? 'text.primary' : 'inherit'}
                  href="#"
                  onClick={() => dispatch(setCurrentFolder(crumb.id))}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {index === 0 && <Home sx={{ mr: 0.5 }} fontSize="inherit" />}
                  {crumb.name}
                </Link>
              ))}
            </Breadcrumbs>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<CreateNewFolder />}
              onClick={() => setCreateFolderOpen(true)}
            >
              Folder Baru
            </Button>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload
            </Button>
          </Box>
        </Box>

        {/* Toolbar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2} flex={1}>
              <TextField
                placeholder="Cari dokumen..."
                value={searchQuery}
                onChange={handleSearch}
                size="small"
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                startIcon={<FilterList />}
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              >
                Filter
              </Button>
              <Button
                startIcon={<Sort />}
                onClick={(e) => setSortAnchorEl(e.currentTarget)}
              >
                Urutkan
              </Button>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewList />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModule />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Content */}
        {viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {/* Folders */}
            {filteredFolders.map((folder) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                        <Folder sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {folder.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {folder.itemCount || 0} item
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(e.currentTarget);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Files */}
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedItems.includes(item.id) ? 2 : 1,
                    borderColor: selectedItems.includes(item.id) ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleItemSelect(item.id)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: 'secondary.main',
                          width: 48,
                          height: 48,
                        }}
                      >
                        <InsertDriveFile />
                      </Avatar>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(e.currentTarget);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip
                        label={item.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper>
            <List>
              {/* Folders */}
              {filteredFolders.map((folder) => (
                <ListItem key={folder.id} disablePadding>
                  <ListItemButton onClick={() => handleFolderClick(folder.id)}>
                    <ListItemIcon>
                      <Folder color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={folder.name}
                      secondary={`${folder.itemCount || 0} item`}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
              {filteredFolders.length > 0 && filteredItems.length > 0 && <Divider />}
              {/* Files */}
              {filteredItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={selectedItems.includes(item.id)}
                    onClick={() => handleItemSelect(item.id)}
                  >
                    <ListItemIcon>
                      <InsertDriveFile />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip label={item.type} size="small" />
                          <Typography variant="caption">
                            {new Date(item.createdAt).toLocaleDateString('id-ID')}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Empty State */}
        {filteredFolders.length === 0 && filteredItems.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}
            textAlign="center"
          >
            <Folder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {searchQuery ? 'Tidak ada hasil ditemukan' : 'Vault masih kosong'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {searchQuery
                ? 'Coba ubah kata kunci pencarian Anda'
                : 'Mulai dengan mengunggah dokumen atau membuat folder baru'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload Dokumen Pertama
              </Button>
            )}
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setUploadDialogOpen(true)}
        >
          <Add />
        </Fab>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Download fontSize="small" /></ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Share fontSize="small" /></ListItemIcon>
            <ListItemText>Bagikan</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
            <ListItemText>Rename</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Star fontSize="small" /></ListItemIcon>
            <ListItemText>Tambah ke Favorit</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
            <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
            <ListItemText>Hapus</ListItemText>
          </MenuItem>
        </Menu>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          <MenuItem onClick={() => setSortAnchorEl(null)}>Nama (A-Z)</MenuItem>
          <MenuItem onClick={() => setSortAnchorEl(null)}>Nama (Z-A)</MenuItem>
          <MenuItem onClick={() => setSortAnchorEl(null)}>Tanggal (Terbaru)</MenuItem>
          <MenuItem onClick={() => setSortAnchorEl(null)}>Tanggal (Terlama)</MenuItem>
          <MenuItem onClick={() => setSortAnchorEl(null)}>Ukuran (Besar)</MenuItem>
          <MenuItem onClick={() => setSortAnchorEl(null)}>Ukuran (Kecil)</MenuItem>
        </Menu>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
        >
          <MenuItem onClick={() => setFilterAnchorEl(null)}>Semua File</MenuItem>
          <MenuItem onClick={() => setFilterAnchorEl(null)}>Dokumen</MenuItem>
          <MenuItem onClick={() => setFilterAnchorEl(null)}>Gambar</MenuItem>
          <MenuItem onClick={() => setFilterAnchorEl(null)}>Video</MenuItem>
          <MenuItem onClick={() => setFilterAnchorEl(null)}>Audio</MenuItem>
        </Menu>

        {/* Create Folder Dialog */}
        <Dialog open={createFolderOpen} onClose={() => setCreateFolderOpen(false)}>
          <DialogTitle>Buat Folder Baru</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nama Folder"
              fullWidth
              variant="outlined"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateFolderOpen(false)}>Batal</Button>
            <Button onClick={handleCreateFolder} variant="contained">
              Buat
            </Button>
          </DialogActions>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Upload Dokumen</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag & drop file di sini
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                atau klik untuk memilih file
              </Typography>
              <Button variant="outlined">Pilih File</Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>Batal</Button>
            <Button variant="contained">Upload</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default Vault;