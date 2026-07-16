import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useApp } from '@/context/AppContext';
import { theme } from '@/styles/theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import Layout from '@/layouts/Layout';
import Dashboard from '@/pages/admin/Dashboard';
import WorkerDashboard from '@/pages/worker/WorkerDashboard';
import Login from '@/pages/login/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

// 로그인 보호 라우트 가드
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  const token = localStorage.getItem('token');

  // 토큰이 있거나 상태 인증이 완료된 경우 렌더링, 아닐 시 로그인 페이지로
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<Login />} />

        {/* 보호 라우트 */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin" replace />} />
          <Route path="admin" element={<Dashboard />} />
          <Route path="worker" element={<WorkerDashboard />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
