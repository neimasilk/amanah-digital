import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FamilyMember } from '../../types';

// Mock API functions
const mockApi = {
  fetchFamilyMembers: async (): Promise<FamilyMember[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: '1',
        name: 'Ahmad bin Abdullah',
        relationship: 'self',
        dateOfBirth: '1980-05-15',
        gender: 'male',
        isAlive: true,
        contactInfo: {
          email: 'ahmad@example.com',
          phone: '+60123456789',
          address: 'Kuala Lumpur, Malaysia'
        },
        documents: [
          {
            id: 'doc1',
            name: 'Birth Certificate',
            type: 'birth_certificate',
            url: '/documents/birth_cert_ahmad.pdf',
            uploadDate: '2023-01-15'
          }
        ],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-15'
      },
      {
        id: '2',
        name: 'Fatimah binti Hassan',
        relationship: 'spouse',
        dateOfBirth: '1985-08-22',
        gender: 'female',
        isAlive: true,
        contactInfo: {
          email: 'fatimah@example.com',
          phone: '+60123456788',
          address: 'Kuala Lumpur, Malaysia'
        },
        documents: [],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      },
      {
        id: '3',
        name: 'Ali bin Ahmad',
        relationship: 'child',
        dateOfBirth: '2010-03-10',
        gender: 'male',
        isAlive: true,
        contactInfo: {
          email: '',
          phone: '',
          address: 'Kuala Lumpur, Malaysia'
        },
        documents: [],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      }
    ];
  },

  addFamilyMember: async (memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newMember: FamilyMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newMember;
  },

  updateFamilyMember: async (id: string, memberData: Partial<FamilyMember>): Promise<FamilyMember> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedMember: FamilyMember = {
      id,
      name: memberData.name || 'Updated Member',
      relationship: memberData.relationship || 'other',
      dateOfBirth: memberData.dateOfBirth || '1990-01-01',
      gender: memberData.gender || 'male',
      isAlive: memberData.isAlive ?? true,
      contactInfo: memberData.contactInfo || {
        email: '',
        phone: '',
        address: ''
      },
      documents: memberData.documents || [],
      createdAt: memberData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return updatedMember;
  },

  deleteFamilyMember: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate successful deletion
  },

  uploadDocument: async (memberId: string, file: File): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: Date.now().toString(),
      name: file.name,
      type: 'document',
      url: `/documents/${file.name}`,
      uploadDate: new Date().toISOString()
    };
  }
};

// Async thunks
export const fetchFamilyMembers = createAsyncThunk(
  'family/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const members = await mockApi.fetchFamilyMembers();
      return members;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch family members');
    }
  }
);

export const addFamilyMember = createAsyncThunk(
  'family/addMember',
  async (memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newMember = await mockApi.addFamilyMember(memberData);
      return newMember;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add family member');
    }
  }
);

export const updateFamilyMember = createAsyncThunk(
  'family/updateMember',
  async ({ id, memberData }: { id: string; memberData: Partial<FamilyMember> }, { rejectWithValue }) => {
    try {
      const updatedMember = await mockApi.updateFamilyMember(id, memberData);
      return updatedMember;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update family member');
    }
  }
);

export const deleteFamilyMember = createAsyncThunk(
  'family/deleteMember',
  async (id: string, { rejectWithValue }) => {
    try {
      await mockApi.deleteFamilyMember(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete family member');
    }
  }
);

export const uploadMemberDocument = createAsyncThunk(
  'family/uploadDocument',
  async ({ memberId, file }: { memberId: string; file: File }, { rejectWithValue }) => {
    try {
      const document = await mockApi.uploadDocument(memberId, file);
      return { memberId, document };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload document');
    }
  }
);

// State interface
interface FamilyState {
  members: FamilyMember[];
  selectedMember: FamilyMember | null;
  isLoading: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isUploading: boolean;
  error: string | null;
  searchQuery: string;
  filterRelationship: string;
  sortBy: 'name' | 'relationship' | 'dateOfBirth';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}

const initialState: FamilyState = {
  members: [],
  selectedMember: null,
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
  isUploading: false,
  error: null,
  searchQuery: '',
  filterRelationship: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  viewMode: 'grid'
};

// Slice
const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    setSelectedMember: (state, action: PayloadAction<FamilyMember | null>) => {
      state.selectedMember = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterRelationship: (state, action: PayloadAction<string>) => {
      state.filterRelationship = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'relationship' | 'dateOfBirth'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.filterRelationship = 'all';
      state.sortBy = 'name';
      state.sortOrder = 'asc';
    }
  },
  extraReducers: (builder) => {
    // Fetch family members
    builder
      .addCase(fetchFamilyMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add family member
      .addCase(addFamilyMember.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(addFamilyMember.fulfilled, (state, action) => {
        state.isAdding = false;
        state.members.push(action.payload);
      })
      .addCase(addFamilyMember.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload as string;
      })
      // Update family member
      .addCase(updateFamilyMember.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateFamilyMember.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.members.findIndex(member => member.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
        if (state.selectedMember?.id === action.payload.id) {
          state.selectedMember = action.payload;
        }
      })
      .addCase(updateFamilyMember.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Delete family member
      .addCase(deleteFamilyMember.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteFamilyMember.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.members = state.members.filter(member => member.id !== action.payload);
        if (state.selectedMember?.id === action.payload) {
          state.selectedMember = null;
        }
      })
      .addCase(deleteFamilyMember.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })
      // Upload document
      .addCase(uploadMemberDocument.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadMemberDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        const { memberId, document } = action.payload;
        const memberIndex = state.members.findIndex(member => member.id === memberId);
        if (memberIndex !== -1) {
          state.members[memberIndex].documents.push(document);
        }
        if (state.selectedMember?.id === memberId) {
          state.selectedMember.documents.push(document);
        }
      })
      .addCase(uploadMemberDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setSelectedMember,
  clearError,
  setSearchQuery,
  setFilterRelationship,
  setSortBy,
  setSortOrder,
  setViewMode,
  resetFilters
} = familySlice.actions;

export default familySlice.reducer;