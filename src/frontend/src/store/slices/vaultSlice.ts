import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vaultAPI } from '../../services/api';

export interface VaultItem {
  id: string;
  title: string;
  type: 'document' | 'password' | 'note' | 'financial' | 'property' | 'other';
  description?: string;
  content: any;
  tags: string[];
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
  accessLevel: 'private' | 'family' | 'heir';
  metadata?: {
    fileSize?: number;
    fileType?: string;
    originalName?: string;
  };
}

export interface VaultFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  items: VaultItem[];
  subfolders: VaultFolder[];
  createdAt: string;
  updatedAt: string;
}

interface VaultState {
  items: VaultItem[];
  folders: VaultFolder[];
  currentFolder: string | null;
  selectedItems: string[];
  searchQuery: string;
  filterType: string | null;
  sortBy: 'name' | 'date' | 'type';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
}

const initialState: VaultState = {
  items: [],
  folders: [],
  currentFolder: null,
  selectedItems: [],
  searchQuery: '',
  filterType: null,
  sortBy: 'date',
  sortOrder: 'desc',
  isLoading: false,
  error: null,
  uploadProgress: 0,
  isUploading: false,
};

// Async thunks
export const fetchVaultItems = createAsyncThunk(
  'vault/fetchItems',
  async (folderId?: string, { rejectWithValue }) => {
    try {
      const response = await vaultAPI.getItems(folderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vault items');
    }
  }
);

export const fetchVaultFolders = createAsyncThunk(
  'vault/fetchFolders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vaultAPI.getFolders();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch vault folders');
    }
  }
);

export const createVaultItem = createAsyncThunk(
  'vault/createItem',
  async (itemData: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await vaultAPI.createItem(itemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create vault item');
    }
  }
);

export const updateVaultItem = createAsyncThunk(
  'vault/updateItem',
  async (
    { id, data }: { id: string; data: Partial<VaultItem> },
    { rejectWithValue }
  ) => {
    try {
      const response = await vaultAPI.updateItem(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update vault item');
    }
  }
);

export const deleteVaultItem = createAsyncThunk(
  'vault/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await vaultAPI.deleteItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete vault item');
    }
  }
);

export const createVaultFolder = createAsyncThunk(
  'vault/createFolder',
  async (
    folderData: { name: string; description?: string; parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await vaultAPI.createFolder(folderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create vault folder');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'vault/uploadFile',
  async (
    { file, metadata }: { file: File; metadata: Partial<VaultItem> },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await vaultAPI.uploadFile(file, metadata, (progress) => {
        dispatch(setUploadProgress(progress));
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to upload file');
    }
  }
);

export const searchVaultItems = createAsyncThunk(
  'vault/searchItems',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await vaultAPI.searchItems(query);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to search vault items');
    }
  }
);

const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setCurrentFolder: (state, action: PayloadAction<string | null>) => {
      state.currentFolder = action.payload;
    },
    setSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.selectedItems.indexOf(itemId);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(itemId);
      }
    },
    clearSelection: (state) => {
      state.selectedItems = [];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterType: (state, action: PayloadAction<string | null>) => {
      state.filterType = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'date' | 'type'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch vault items
    builder
      .addCase(fetchVaultItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVaultItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.error = null;
      })
      .addCase(fetchVaultItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch vault folders
    builder
      .addCase(fetchVaultFolders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVaultFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload.folders || [];
        state.error = null;
      })
      .addCase(fetchVaultFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create vault item
    builder
      .addCase(createVaultItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVaultItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload.item);
        state.error = null;
      })
      .addCase(createVaultItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update vault item
    builder
      .addCase(updateVaultItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVaultItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.item.id);
        if (index !== -1) {
          state.items[index] = action.payload.item;
        }
        state.error = null;
      })
      .addCase(updateVaultItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete vault item
    builder
      .addCase(deleteVaultItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVaultItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.selectedItems = state.selectedItems.filter(id => id !== action.payload);
        state.error = null;
      })
      .addCase(deleteVaultItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create vault folder
    builder
      .addCase(createVaultFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVaultFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders.push(action.payload.folder);
        state.error = null;
      })
      .addCase(createVaultFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Upload file
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        state.items.unshift(action.payload.item);
        state.error = null;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      });

    // Search vault items
    builder
      .addCase(searchVaultItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchVaultItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.error = null;
      })
      .addCase(searchVaultItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentFolder,
  setSelectedItems,
  toggleItemSelection,
  clearSelection,
  setSearchQuery,
  setFilterType,
  setSortBy,
  setSortOrder,
  setUploadProgress,
  setIsUploading,
  clearError,
} = vaultSlice.actions;

export default vaultSlice.reducer;