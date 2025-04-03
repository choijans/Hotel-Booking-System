
import { useAuth } from '../context/AuthProvider'; // Import the AuthProvider context
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection
import AuthNav from '../components/nav/authnav'; // Import the AuthNav component

const AuthLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <>
      <AuthNav />
      <Outlet />
    </>
  );
};


export default AuthLayout;