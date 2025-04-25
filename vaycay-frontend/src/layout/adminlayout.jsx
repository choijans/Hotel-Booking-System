import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import AdminNav from "../components/nav/adminnav";

const AdminLayout = () => {
    const { currentUser } = useAuth();
  
    if (!currentUser || currentUser.role !== "admin") {
      return <Navigate to="/login" />;
    }
  
    return (
      <div className="bg-FFFDF7 admin-layout flex">
        <AdminNav />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  };
  
  export default AdminLayout;