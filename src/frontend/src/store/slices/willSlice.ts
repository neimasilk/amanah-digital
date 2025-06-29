import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Will, WillTemplate } from '../../types';

// Mock API functions - replace with actual API calls
const mockWillApi = {
  getTemplates: async (): Promise<WillTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '1',
        name: 'Wasiat Sederhana',
        description: 'Template wasiat untuk kebutuhan dasar',
        category: 'basic',
        content: 'Template wasiat sederhana sesuai hukum Islam...',
        fields: [
          { name: 'testatorName', label: 'Nama Pewasiat', type: 'text', required: true },
          { name: 'executorName', label: 'Nama Pelaksana', type: 'text', required: true },
          { name: 'assets', label: 'Daftar Harta', type: 'textarea', required: true },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Wasiat Lengkap',
        description: 'Template wasiat lengkap dengan detail properti',
        category: 'comprehensive',
        content: 'Template wasiat lengkap dengan pembagian detail...',
        fields: [
          { name: 'testatorName', label: 'Nama Pewasiat', type: 'text', required: true },
          { name: 'executorName', label: 'Nama Pelaksana', type: 'text', required: true },
          { name: 'guardianName', label: 'Nama Wali', type: 'text', required: false },
          { name: 'realEstate', label: 'Properti', type: 'textarea', required: false },
          { name: 'personalProperty', label: 'Harta Bergerak', type: 'textarea', required: false },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  saveWill: async (will: Partial<Will>): Promise<Will> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: Date.now().toString(),
      testatorName: will.testatorName || '',
      testatorAddress: will.testatorAddress || '',
      testatorPhone: will.testatorPhone || '',
      executorName: will.executorName || '',
      executorAddress: will.executorAddress || '',
      executorPhone: will.executorPhone || '',
      guardianName: will.guardianName,
      guardianAddress: will.guardianAddress,
      guardianPhone: will.guardianPhone,
      beneficiaries: will.beneficiaries || [],
      assets: will.assets || [],
      specialInstructions: will.specialInstructions || '',
      witnesses: will.witnesses || [],
      templateId: will.templateId,
      content: will.content || '',
      status: 'draft',
      isValid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  getWills: async (): Promise<Will[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '1',
        testatorName: 'Ahmad bin Abdullah',
        testatorAddress: 'Jl. Merdeka No. 123, Jakarta',
        testatorPhone: '+60123456789',
        executorName: 'Muhammad bin Ahmad',
        executorAddress: 'Jl. Sudirman No. 456, Jakarta',
        executorPhone: '+60123456788',
        beneficiaries: [
          {
            id: '1',
            name: 'Siti binti Ahmad',
            relationship: 'Istri',
            share: 0.125,
            assets: ['Rumah utama'],
          },
          {
            id: '2',
            name: 'Ali bin Ahmad',
            relationship: 'Anak',
            share: 0.5,
            assets: ['Tanah kebun', 'Mobil'],
          },
        ],
        assets: [
          {
            id: '1',
            type: 'Properti',
            description: 'Rumah di Jl. Merdeka No. 123',
            value: 800000000,
            beneficiary: 'Siti binti Ahmad',
          },
          {
            id: '2',
            type: 'Kendaraan',
            description: 'Toyota Camry 2020',
            value: 400000000,
            beneficiary: 'Ali bin Ahmad',
          },
        ],
        specialInstructions: 'Pembagian harta mengikuti hukum Islam',
        witnesses: [
          {
            id: '1',
            name: 'Dr. Abdullah',
            address: 'Jl. Kebon Jeruk No. 789',
            phone: '+60123456787',
          },
          {
            id: '2',
            name: 'Ustadz Ibrahim',
            address: 'Jl. Masjid No. 321',
            phone: '+60123456786',
          },
        ],
        templateId: '1',
        content: 'Wasiat lengkap Ahmad bin Abdullah...',
        status: 'draft',
        isValid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  generateWill: async (data: any): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `
WASIAT

Saya yang bertanda tangan di bawah ini:
Nama: ${data.testatorName}
Alamat: ${data.testatorAddress}
Telepon: ${data.testatorPhone}

Dengan ini menyatakan wasiat saya sebagai berikut:

1. PELAKSANA WASIAT
Nama: ${data.executorName}
Alamat: ${data.executorAddress}
Telepon: ${data.executorPhone}

2. PEMBAGIAN HARTA
${data.assets.map((asset: any, index: number) => 
  `${index + 1}. ${asset.description} - Nilai: Rp ${asset.value.toLocaleString('id-ID')} - Untuk: ${asset.beneficiary}`
).join('\n')}

3. INSTRUKSI KHUSUS
${data.specialInstructions}

4. SAKSI-SAKSI
${data.witnesses.map((witness: any, index: number) => 
  `${index + 1}. ${witness.name} - ${witness.address} - ${witness.phone}`
).join('\n')}

Wasiat ini dibuat dengan penuh kesadaran dan tanpa paksaan dari pihak manapun.

Tanggal: ${new Date().toLocaleDateString('id-ID')}

Tanda tangan Pewasiat,


${data.testatorName}
    `;
  },
};

interface WillState {
  wills: Will[];
  templates: WillTemplate[];
  currentWill: Will | null;
  selectedTemplate: WillTemplate | null;
  generatedContent: string;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  formData: {
    step: number;
    testatorInfo: {
      name: string;
      address: string;
      phone: string;
      dateOfBirth: string;
    };
    executorInfo: {
      name: string;
      address: string;
      phone: string;
    };
    guardianInfo: {
      name: string;
      address: string;
      phone: string;
    };
    beneficiaries: Array<{
      name: string;
      relationship: string;
      share: number;
      assets: string[];
    }>;
    assets: Array<{
      type: string;
      description: string;
      value: number;
      beneficiary: string;
    }>;
    specialInstructions: string;
    witnesses: Array<{
      name: string;
      address: string;
      phone: string;
    }>;
  };
}

const initialState: WillState = {
  wills: [],
  templates: [],
  currentWill: null,
  selectedTemplate: null,
  generatedContent: '',
  isLoading: false,
  isGenerating: false,
  error: null,
  formData: {
    step: 1,
    testatorInfo: {
      name: '',
      address: '',
      phone: '',
      dateOfBirth: '',
    },
    executorInfo: {
      name: '',
      address: '',
      phone: '',
    },
    guardianInfo: {
      name: '',
      address: '',
      phone: '',
    },
    beneficiaries: [],
    assets: [],
    specialInstructions: '',
    witnesses: [],
  },
};

// Async thunks
export const fetchWillTemplates = createAsyncThunk(
  'will/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const templates = await mockWillApi.getTemplates();
      return templates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch templates');
    }
  }
);

export const saveWill = createAsyncThunk(
  'will/save',
  async (willData: Partial<Will>, { rejectWithValue }) => {
    try {
      const will = await mockWillApi.saveWill(willData);
      return will;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save will');
    }
  }
);

export const fetchWills = createAsyncThunk(
  'will/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const wills = await mockWillApi.getWills();
      return wills;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wills');
    }
  }
);

export const generateWillContent = createAsyncThunk(
  'will/generate',
  async (data: any, { rejectWithValue }) => {
    try {
      const content = await mockWillApi.generateWill(data);
      return content;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate will');
    }
  }
);

const willSlice = createSlice({
  name: 'will',
  initialState,
  reducers: {
    setCurrentWill: (state, action: PayloadAction<Will | null>) => {
      state.currentWill = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<WillTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    setFormStep: (state, action: PayloadAction<number>) => {
      state.formData.step = action.payload;
    },
    updateTestatorInfo: (state, action: PayloadAction<Partial<typeof initialState.formData.testatorInfo>>) => {
      state.formData.testatorInfo = { ...state.formData.testatorInfo, ...action.payload };
    },
    updateExecutorInfo: (state, action: PayloadAction<Partial<typeof initialState.formData.executorInfo>>) => {
      state.formData.executorInfo = { ...state.formData.executorInfo, ...action.payload };
    },
    updateGuardianInfo: (state, action: PayloadAction<Partial<typeof initialState.formData.guardianInfo>>) => {
      state.formData.guardianInfo = { ...state.formData.guardianInfo, ...action.payload };
    },
    addBeneficiary: (state, action: PayloadAction<typeof initialState.formData.beneficiaries[0]>) => {
      state.formData.beneficiaries.push(action.payload);
    },
    updateBeneficiary: (state, action: PayloadAction<{ index: number; beneficiary: Partial<typeof initialState.formData.beneficiaries[0]> }>) => {
      const { index, beneficiary } = action.payload;
      if (state.formData.beneficiaries[index]) {
        state.formData.beneficiaries[index] = { ...state.formData.beneficiaries[index], ...beneficiary };
      }
    },
    removeBeneficiary: (state, action: PayloadAction<number>) => {
      state.formData.beneficiaries.splice(action.payload, 1);
    },
    addAsset: (state, action: PayloadAction<typeof initialState.formData.assets[0]>) => {
      state.formData.assets.push(action.payload);
    },
    updateAsset: (state, action: PayloadAction<{ index: number; asset: Partial<typeof initialState.formData.assets[0]> }>) => {
      const { index, asset } = action.payload;
      const existingAsset = state.formData.assets[index];
      if (existingAsset) {
        if (asset.type !== undefined) existingAsset.type = asset.type;
        if (asset.description !== undefined) existingAsset.description = asset.description;
        if (asset.value !== undefined) existingAsset.value = asset.value;
        if (asset.beneficiary !== undefined) existingAsset.beneficiary = asset.beneficiary;
      }
    },
    removeAsset: (state, action: PayloadAction<number>) => {
      state.formData.assets.splice(action.payload, 1);
    },
    updateSpecialInstructions: (state, action: PayloadAction<string>) => {
      state.formData.specialInstructions = action.payload;
    },
    addWitness: (state, action: PayloadAction<typeof initialState.formData.witnesses[0]>) => {
      state.formData.witnesses.push(action.payload);
    },
    updateWitness: (state, action: PayloadAction<{ index: number; witness: Partial<{ name: string; address: string; phone: string; }> }>) => {
      const { index, witness } = action.payload;
      const existingWitness = state.formData.witnesses[index];
      if (existingWitness) {
        if (witness.name !== undefined) existingWitness.name = witness.name;
        if (witness.address !== undefined) existingWitness.address = witness.address;
        if (witness.phone !== undefined) existingWitness.phone = witness.phone;
      }
    },
    removeWitness: (state, action: PayloadAction<number>) => {
      state.formData.witnesses.splice(action.payload, 1);
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.currentWill = null;
      state.selectedTemplate = null;
      state.generatedContent = '';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch templates
      .addCase(fetchWillTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWillTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.error = null;
      })
      .addCase(fetchWillTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Save will
      .addCase(saveWill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveWill.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.wills.findIndex(will => will.id === action.payload.id);
        if (existingIndex > -1) {
          state.wills[existingIndex] = action.payload;
        } else {
          state.wills.push(action.payload);
        }
        state.currentWill = action.payload;
        state.error = null;
      })
      .addCase(saveWill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch wills
      .addCase(fetchWills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wills = action.payload;
        state.error = null;
      })
      .addCase(fetchWills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Generate will content
      .addCase(generateWillContent.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateWillContent.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.generatedContent = action.payload;
        state.error = null;
      })
      .addCase(generateWillContent.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentWill,
  setSelectedTemplate,
  setFormStep,
  updateTestatorInfo,
  updateExecutorInfo,
  updateGuardianInfo,
  addBeneficiary,
  updateBeneficiary,
  removeBeneficiary,
  addAsset,
  updateAsset,
  removeAsset,
  updateSpecialInstructions,
  addWitness,
  updateWitness,
  removeWitness,
  resetForm,
  clearError,
} = willSlice.actions;

export default willSlice.reducer;