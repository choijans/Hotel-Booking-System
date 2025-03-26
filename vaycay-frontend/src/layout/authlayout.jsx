import Navbar from '../components/nav/navbar';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">{children}</main> {/* More top padding for dashboard content */}
    </div>
  );
};

export default AuthLayout;