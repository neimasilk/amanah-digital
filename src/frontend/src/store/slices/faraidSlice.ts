import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FaraidCalculation } from '../../types';

// Mock API functions - replace with actual API calls
const mockFaraidApi = {
  calculateFaraid: async (data: any): Promise<FaraidCalculation> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock calculation result
    return {
      id: Date.now().toString(),
      deceasedName: data.deceasedName,
      deceasedGender: data.deceasedGender,
      totalAssets: data.totalAssets,
      totalDebts: data.totalDebts,
      heirs: data.heirs.map((heir: any, index: number) => ({
        id: (index + 1).toString(),
        name: heir.name,
        relationship: heir.relationship,
        gender: heir.gender,
        isAlive: heir.isAlive,
        share: Math.random() * 0.5, // Mock share calculation
        amount: (data.totalAssets - data.totalDebts) * Math.random() * 0.5,
      })),
      calculations: {
        netAssets: data.totalAssets - data.totalDebts,
        totalShares: 1,
        remainingAssets: 0,
      },
      islamicRules: [
        'Pembagian warisan mengikuti hukum Islam',
        'Ahli waris laki-laki mendapat bagian 2x lipat dari perempuan dalam kategori yang sama',
        'Orang tua mendapat bagian 1/6 jika ada anak',
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  saveCalculation: async (calculation: FaraidCalculation): Promise<FaraidCalculation> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...calculation, id: Date.now().toString() };
  },

  getCalculations: async (): Promise<FaraidCalculation[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock saved calculations
    return [
      {
        id: '1',
        deceasedName: 'Ahmad bin Abdullah',
        deceasedGender: 'male',
        totalAssets: 1000000,
        totalDebts: 100000,
        heirs: [
          {
            id: '1',
            name: 'Siti (Istri)',
            relationship: 'spouse',
            gender: 'female',
            isAlive: true,
            share: 0.125,
            amount: 112500,
          },
          {
            id: '2',
            name: 'Muhammad (Anak)',
            relationship: 'child',
            gender: 'male',
            isAlive: true,
            share: 0.583,
            amount: 525000,
          },
        ],
        calculations: {
          netAssets: 900000,
          totalShares: 1,
          remainingAssets: 0,
        },
        islamicRules: [
          'Pembagian warisan mengikuti hukum Islam',
          'Istri mendapat 1/8 jika ada anak',
          'Anak laki-laki mendapat sisa setelah bagian istri',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },
};

interface FaraidState {
  calculations: FaraidCalculation[];
  currentCalculation: FaraidCalculation | null;
  isCalculating: boolean;
  isLoading: boolean;
  error: string | null;
  formData: {
    deceasedInfo: {
      name: string;
      gender: 'male' | 'female';
      dateOfDeath: string;
    };
    heirs: Array<{
      name: string;
      relationship: string;
      gender: 'male' | 'female';
      isAlive: boolean;
    }>;
    assets: {
      totalAssets: number;
      totalDebts: number;
      assetDetails: Array<{
        type: string;
        description: string;
        value: number;
      }>;
    };
  };
}

const initialState: FaraidState = {
  calculations: [],
  currentCalculation: null,
  isCalculating: false,
  isLoading: false,
  error: null,
  formData: {
    deceasedInfo: {
      name: '',
      gender: 'male',
      dateOfDeath: '',
    },
    heirs: [],
    assets: {
      totalAssets: 0,
      totalDebts: 0,
      assetDetails: [],
    },
  },
};

// Async thunks
export const calculateFaraid = createAsyncThunk(
  'faraid/calculate',
  async (data: any, { rejectWithValue }) => {
    try {
      const result = await mockFaraidApi.calculateFaraid(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Calculation failed');
    }
  }
);

export const saveCalculation = createAsyncThunk(
  'faraid/save',
  async (calculation: FaraidCalculation, { rejectWithValue }) => {
    try {
      const result = await mockFaraidApi.saveCalculation(calculation);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save calculation');
    }
  }
);

export const fetchCalculations = createAsyncThunk(
  'faraid/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const result = await mockFaraidApi.getCalculations();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch calculations');
    }
  }
);

const faraidSlice = createSlice({
  name: 'faraid',
  initialState,
  reducers: {
    setCurrentCalculation: (state, action: PayloadAction<FaraidCalculation | null>) => {
      state.currentCalculation = action.payload;
    },
    updateFormData: (state, action: PayloadAction<Partial<typeof initialState.formData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    updateDeceasedInfo: (state, action: PayloadAction<Partial<typeof initialState.formData.deceasedInfo>>) => {
      state.formData.deceasedInfo = { ...state.formData.deceasedInfo, ...action.payload };
    },
    addHeir: (state, action: PayloadAction<typeof initialState.formData.heirs[0]>) => {
      state.formData.heirs.push(action.payload);
    },
    updateHeir: (state, action: PayloadAction<{ index: number; heir: Partial<typeof initialState.formData.heirs[0]> }>) => {
      const { index, heir } = action.payload;
      if (state.formData.heirs[index]) {
        state.formData.heirs[index] = { ...state.formData.heirs[index], ...heir };
      }
    },
    removeHeir: (state, action: PayloadAction<number>) => {
      state.formData.heirs.splice(action.payload, 1);
    },
    updateAssets: (state, action: PayloadAction<Partial<typeof initialState.formData.assets>>) => {
      state.formData.assets = { ...state.formData.assets, ...action.payload };
    },
    addAssetDetail: (state, action: PayloadAction<typeof initialState.formData.assets.assetDetails[0]>) => {
      state.formData.assets.assetDetails.push(action.payload);
    },
    updateAssetDetail: (state, action: PayloadAction<{ index: number; asset: Partial<typeof initialState.formData.assets.assetDetails[0]> }>) => {
      const { index, asset } = action.payload;
      if (state.formData.assets.assetDetails[index]) {
        state.formData.assets.assetDetails[index] = { ...state.formData.assets.assetDetails[index], ...asset };
      }
    },
    removeAssetDetail: (state, action: PayloadAction<number>) => {
      state.formData.assets.assetDetails.splice(action.payload, 1);
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.currentCalculation = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Calculate Faraid
      .addCase(calculateFaraid.pending, (state) => {
        state.isCalculating = true;
        state.error = null;
      })
      .addCase(calculateFaraid.fulfilled, (state, action) => {
        state.isCalculating = false;
        state.currentCalculation = action.payload;
        state.error = null;
      })
      .addCase(calculateFaraid.rejected, (state, action) => {
        state.isCalculating = false;
        state.error = action.payload as string;
      })
      // Save calculation
      .addCase(saveCalculation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveCalculation.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.calculations.findIndex(calc => calc.id === action.payload.id);
        if (existingIndex > -1) {
          state.calculations[existingIndex] = action.payload;
        } else {
          state.calculations.push(action.payload);
        }
        state.error = null;
      })
      .addCase(saveCalculation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch calculations
      .addCase(fetchCalculations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalculations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calculations = action.payload;
        state.error = null;
      })
      .addCase(fetchCalculations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentCalculation,
  updateFormData,
  updateDeceasedInfo,
  addHeir,
  updateHeir,
  removeHeir,
  updateAssets,
  addAssetDetail,
  updateAssetDetail,
  removeAssetDetail,
  resetForm,
  clearError,
} = faraidSlice.actions;

export default faraidSlice.reducer;