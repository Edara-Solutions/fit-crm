import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { routes } from './routes';

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
