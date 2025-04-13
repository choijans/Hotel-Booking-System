import { useAuth } from "../context/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";
import AuthNav from "../components/nav/authnav"; // Import AuthNav

const AuthLayout = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Show a loading state while initializing auth

  if (!currentUser && !localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <AuthNav /> {/* Add the authenticated navigation bar */}
      <Outlet />
    </>
  );
};

export default AuthLayout;