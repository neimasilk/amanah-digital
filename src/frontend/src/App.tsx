import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { theme } from './theme';
import { NotificationProvider } from './components/Common/NotificationProvider';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Loading from './components/Common/Loading';
import ProtectedRoute, { PublicRoute } from './components/Auth/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Vault from './pages/Vault';
import FaraidCalculator from './pages/FaraidCalculator';
import WillGuide from './pages/WillGuide';
import FamilyManagement from './pages/FamilyManagement';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

// Lazy load pages for better performance
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Help = React.lazy(() => import('./pages/Help'));
const About = React.lazy(() => import('./pages/About'));



const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<Loading variant="page" />} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginForm />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <RegisterForm />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Navigate to="/dashboard" replace />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vault"
                    element={
                      <ProtectedRoute>
                        <Vault />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/faraid-calculator"
                    element={
                      <ProtectedRoute>
                        <FaraidCalculator />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/will-guide"
                    element={
                      <ProtectedRoute>
                        <WillGuide />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/family"
                    element={
                      <ProtectedRoute>
                        <FamilyManagement />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Lazy Loaded Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <React.Suspense fallback={<Loading variant="page" />}>
                          <Profile />
                        </React.Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <React.Suspense fallback={<Loading variant="page" />}>
                          <Settings />
                        </React.Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/help"
                    element={
                      <ProtectedRoute>
                        <React.Suspense fallback={<Loading variant="page" />}>
                          <Help />
                        </React.Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <ProtectedRoute>
                        <React.Suspense fallback={<Loading variant="page" />}>
                          <About />
                        </React.Suspense>
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch all route - 404 */}
                  <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          height: '100vh',
                          textAlign: 'center'
                        }}>
                          <h1>404 - Halaman Tidak Ditemukan</h1>
                          <p>Halaman yang Anda cari tidak tersedia.</p>
                          <button 
                            onClick={() => window.location.href = '/dashboard'}
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#1976d2',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Kembali ke Dashboard
                          </button>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </NotificationProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;