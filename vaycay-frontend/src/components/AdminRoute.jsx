import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;