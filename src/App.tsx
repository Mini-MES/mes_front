import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppProvider } from './context/AppContext';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Layout from './layouts/Layout';
import Dashboard from './pages/admin/Dashboard';
import WorkerDashboard from './pages/worker/WorkerDashboard';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/admin" replace />} />
              <Route path="admin" element={<Dashboard />} />
              <Route path="worker" element={<WorkerDashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
