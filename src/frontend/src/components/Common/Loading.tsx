import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

interface LoadingProps {
  variant?: 'circular' | 'skeleton' | 'page' | 'card' | 'table';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  rows?: number;
  height?: number | string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'circular',
  size = 'medium',
  text,
  rows = 3,
  height = 200,
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  if (variant === 'circular') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
      >
        <CircularProgress size={getSizeValue()} />
        {text && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'page') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        p={3}
      >
        <CircularProgress size={60} />
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {text || 'Memuat...'}
        </Typography>
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box ml={2} flex={1}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
          <Skeleton variant="rectangular" height={height} />
          <Box mt={2}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'table') {
    return (
      <Box>
        {Array.from({ length: rows }).map((_, index) => (
          <Box key={index} display="flex" alignItems="center" py={1}>
            <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2 }} />
            <Box flex={1}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Skeleton variant="text" />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="text" />
                </Grid>
                <Grid item xs={3}>
                  <Skeleton variant="text" />
                </Grid>
                <Grid item xs={2}>
                  <Skeleton variant="text" />
                </Grid>
              </Grid>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // Default skeleton variant
  return (
    <Box>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={40}
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );
};

export default Loading;

// Specific loading components for common use cases
export const PageLoading: React.FC<{ text?: string }> = ({ text }) => (
  <Loading variant="page" text={text} />
);

export const CardLoading: React.FC<{ height?: number | string }> = ({ height }) => (
  <Loading variant="card" height={height} />
);

export const TableLoading: React.FC<{ rows?: number }> = ({ rows }) => (
  <Loading variant="table" rows={rows} />
);

export const ButtonLoading: React.FC = () => (
  <CircularProgress size={20} color="inherit" />
);