import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  userWithoutPassword: {
    Email: string;
    EstadoID: number;
    FechaCreacion: string;
    FechaModificacion: string | null;
    NombreCompleto: string;
    RoleID: number;
    Telefono: number;
    UserID: number;
    Usuario: string;
    UsuarioCreaID: number;
    UsuarioModificaID: number | null;
  };
}
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}


export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { token, loading } = useAuth();
  let user: DecodedToken | null = null;

  if (token) {
    try {
      user = jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.userWithoutPassword.RoleID !== 1) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}