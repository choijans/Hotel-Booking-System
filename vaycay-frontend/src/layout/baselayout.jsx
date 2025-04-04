import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Import the AuthProvider context
import GuestNav from '../components/nav/guestnav'; // Import the GuestNav component

const BaseLayout = () => {
  const { currentUser } = useAuth();

  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <>
      <GuestNav />
      <Outlet />
    </>
  );
};

export default BaseLayout;