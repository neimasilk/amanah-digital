import React from 'react';
import { SnackbarProvider, useSnackbar, VariantType } from 'notistack';
import {
  IconButton,
  Alert,
  AlertTitle,
  Box,
  Typography,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';

interface NotificationProviderProps {
  children: React.ReactNode;
}

// Custom notification component
const CustomNotification = React.forwardRef<
  HTMLDivElement,
  {
    id: string | number;
    message: string;
    variant: VariantType;
    title?: string;
    onClose?: () => void;
  }
>(({ id, message, variant, title, onClose }, ref) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      default:
        return <Info />;
    }
  };

  const getSeverity = (): 'success' | 'error' | 'warning' | 'info' => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <Alert
      ref={ref}
      severity={getSeverity()}
      icon={getIcon()}
      action={
        onClose && (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <Close fontSize="inherit" />
          </IconButton>
        )
      }
      sx={{
        minWidth: 300,
        maxWidth: 500,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
});

CustomNotification.displayName = 'CustomNotification';

// Notification provider component
const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={5000}
      preventDuplicate
      dense
      Components={{
        success: CustomNotification,
        error: CustomNotification,
        warning: CustomNotification,
        info: CustomNotification,
        default: CustomNotification,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;

// Hook for using notifications
export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = React.useCallback(
    (
      message: string,
      variant: VariantType = 'info',
      options?: {
        title?: string;
        persist?: boolean;
        action?: React.ReactNode;
      }
    ) => {
      return enqueueSnackbar(message, {
        variant,
        persist: options?.persist,
        action: options?.action,
        // Pass custom props to the notification component
        title: options?.title,
      } as any);
    },
    [enqueueSnackbar]
  );

  const showSuccess = React.useCallback(
    (message: string, title?: string) => {
      return showNotification(message, 'success', { title });
    },
    [showNotification]
  );

  const showError = React.useCallback(
    (message: string, title?: string) => {
      return showNotification(message, 'error', { title });
    },
    [showNotification]
  );

  const showWarning = React.useCallback(
    (message: string, title?: string) => {
      return showNotification(message, 'warning', { title });
    },
    [showNotification]
  );

  const showInfo = React.useCallback(
    (message: string, title?: string) => {
      return showNotification(message, 'info', { title });
    },
    [showNotification]
  );

  const hideNotification = React.useCallback(
    (key?: string | number) => {
      closeSnackbar(key);
    },
    [closeSnackbar]
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
};

// Utility functions for common notification patterns
export const notificationUtils = {
  success: (message: string, title?: string) => ({
    message,
    variant: 'success' as VariantType,
    title,
  }),
  error: (message: string, title?: string) => ({
    message,
    variant: 'error' as VariantType,
    title,
  }),
  warning: (message: string, title?: string) => ({
    message,
    variant: 'warning' as VariantType,
    title,
  }),
  info: (message: string, title?: string) => ({
    message,
    variant: 'info' as VariantType,
    title,
  }),
};