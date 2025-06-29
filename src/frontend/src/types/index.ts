// Common types used across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    language: 'id' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface VaultItem {
  id: string;
  title: string;
  type: 'document' | 'password' | 'note' | 'financial' | 'property' | 'other';
  description?: string;
  content: any;
  tags: string[];
  isEncrypted: boolean;
  folderId?: string;
  accessLevel: 'private' | 'family' | 'heir';
  sharedWith?: Array<{
    userId: string;
    email: string;
    accessLevel: 'view' | 'edit';
    expiresAt?: string;
  }>;
  metadata?: {
    fileSize?: number;
    fileType?: string;
    originalName?: string;
    checksum?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VaultFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  isShared: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FaraidCalculation {
  id: string;
  title: string;
  description?: string;
  assets: Array<{
    id: string;
    type: 'cash' | 'property' | 'investment' | 'business' | 'other';
    description: string;
    value: number;
    currency: string;
  }>;
  heirs: Array<{
    id: string;
    name: string;
    relationship: string;
    gender: 'male' | 'female';
    isAlive: boolean;
    birthDate?: string;
    notes?: string;
  }>;
  debts: number;
  wasiyyah: number;
  result?: {
    totalAssets: number;
    totalDebts: number;
    totalWasiyyah: number;
    inheritableAssets: number;
    distribution: Array<{
      heirId: string;
      heirName: string;
      relationship: string;
      share: number;
      percentage: number;
      basis: string;
    }>;
    calculatedAt: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Will {
  id: string;
  title: string;
  templateId?: string;
  content: {
    personal: {
      fullName: string;
      idNumber: string;
      birthDate: string;
      birthPlace: string;
      address: string;
      religion: string;
      maritalStatus: string;
    };
    assets: Array<{
      type: string;
      description: string;
      value?: number;
      location?: string;
      beneficiary: string;
      conditions?: string;
    }>;
    guardians?: Array<{
      name: string;
      relationship: string;
      idNumber: string;
      address: string;
      phone: string;
    }>;
    executors: Array<{
      name: string;
      relationship: string;
      idNumber: string;
      address: string;
      phone: string;
      isPrimary: boolean;
    }>;
    witnesses: Array<{
      name: string;
      idNumber: string;
      address: string;
      phone: string;
    }>;
    specialInstructions?: string;
    digitalAssets?: Array<{
      platform: string;
      username: string;
      instructions: string;
    }>;
  };
  status: 'draft' | 'completed' | 'notarized' | 'archived';
  notaryInfo?: {
    name: string;
    licenseNumber: string;
    office: string;
    notarizedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WillTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'family' | 'business' | 'islamic' | 'custom';
  language: 'id' | 'en';
  content: any;
  isPublic: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'grandparent' | 'grandchild' | 'other';
  dateOfBirth: string;
  gender: 'male' | 'female';
  isAlive: boolean;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface SystemStats {
  users: {
    total: number;
    active: number;
    verified: number;
    newThisMonth: number;
  };
  vault: {
    totalItems: number;
    totalSize: number;
    itemsByType: Record<string, number>;
  };
  calculations: {
    total: number;
    thisMonth: number;
  };
  wills: {
    total: number;
    completed: number;
    notarized: number;
  };
  system: {
    uptime: number;
    version: string;
    lastBackup: string;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdatePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateForm {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  type?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
}

// Language types
export interface LanguageConfig {
  code: 'id' | 'en';
  name: string;
  flag: string;
  rtl: boolean;
}