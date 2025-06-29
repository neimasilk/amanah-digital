import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for common state selections
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useUI = () => {
  return useAppSelector((state) => state.ui);
};

export const useVault = () => {
  return useAppSelector((state) => state.vault);
};

// Specific selectors
export const useCurrentUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

export const useAuthLoading = () => {
  return useAppSelector((state) => state.auth.isLoading);
};

export const useAuthError = () => {
  return useAppSelector((state) => state.auth.error);
};

export const useTheme = () => {
  return useAppSelector((state) => state.ui.theme);
};

export const useLanguage = () => {
  return useAppSelector((state) => state.ui.language);
};

export const useSidebarOpen = () => {
  return useAppSelector((state) => state.ui.sidebarOpen);
};

export const useNotifications = () => {
  return useAppSelector((state) => state.ui.notifications);
};

export const useModal = () => {
  return useAppSelector((state) => state.ui.modal);
};

export const useBreadcrumbs = () => {
  return useAppSelector((state) => state.ui.breadcrumbs);
};

export const useVaultItems = () => {
  return useAppSelector((state) => state.vault.items);
};

export const useVaultFolders = () => {
  return useAppSelector((state) => state.vault.folders);
};

export const useVaultLoading = () => {
  return useAppSelector((state) => state.vault.isLoading);
};

export const useVaultError = () => {
  return useAppSelector((state) => state.vault.error);
};

export const useSelectedItems = () => {
  return useAppSelector((state) => state.vault.selectedItems);
};

export const useCurrentFolder = () => {
  return useAppSelector((state) => state.vault.currentFolder);
};

export const useSearchQuery = () => {
  return useAppSelector((state) => state.vault.searchQuery);
};

export const useUploadProgress = () => {
  return useAppSelector((state) => ({
    progress: state.vault.uploadProgress,
    isUploading: state.vault.isUploading,
  }));
};