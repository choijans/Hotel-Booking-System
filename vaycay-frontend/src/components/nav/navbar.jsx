import { useAuth } from '../../context/AuthContext';
import AuthNav from './AuthNav';
import GuestNav from './GuestNav';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return isAuthenticated ? (
    <AuthNav handleLogout={logout} />
  ) : (
    <GuestNav />
  );
};

export default Navbar;

