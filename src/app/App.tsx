import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { ToastViewport } from '../components/ui/ToastViewport';
import { routes } from './routes';

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastViewport />
      </BrowserRouter>
    </AuthProvider>
  );
}
