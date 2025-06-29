import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Container,
} from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                p={4}
              >
                <BugReport
                  sx={{
                    fontSize: 64,
                    color: 'error.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h4" gutterBottom>
                  Oops! Terjadi Kesalahan
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah
                  diberitahu tentang masalah ini.
                </Typography>

                <Box sx={{ mt: 3, mb: 3 }}>
                  <Button
                    variant="contained"
                    onClick={this.handleReload}
                    startIcon={<Refresh />}
                    sx={{ mr: 2 }}
                  >
                    Muat Ulang Halaman
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={this.handleReset}
                  >
                    Coba Lagi
                  </Button>
                </Box>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Alert severity="error" sx={{ mt: 3, textAlign: 'left', width: '100%' }}>
                    <AlertTitle>Error Details (Development Mode)</AlertTitle>
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {this.state.error.toString()}
                    </Typography>
                    {this.state.errorInfo && (
                      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                        {this.state.errorInfo.componentStack}
                      </Typography>
                    )}
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Functional component for simple error display
export const ErrorDisplay: React.FC<{
  error: string | Error;
  onRetry?: () => void;
  title?: string;
}> = ({ error, onRetry, title = 'Terjadi Kesalahan' }) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      textAlign="center"
    >
      <BugReport
        sx={{
          fontSize: 48,
          color: 'error.main',
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {errorMessage}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          startIcon={<Refresh />}
          size="small"
        >
          Coba Lagi
        </Button>
      )}
    </Box>
  );
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  return {
    error,
    resetError,
    handleError,
  };
};