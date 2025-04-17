import { useAuth } from "../../context/AuthProvider"; // Import the AuthProvider context
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Import the user icon

const AuthNav = ( ) => {

  return (
    <nav className="bg-beige-600 shadow-md">
      <div className="py-4 pl-12 pr-4 sm:pl-16 sm:pr-6 lg:pl-24 lg:pr-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard">
              <img className="h-16 w-auto" src="/src/assets/logo.png" alt="Vacay Logo" />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/hotels" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
              Recommended Hotels
            </Link>
            <a href="/aboutUs" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
              About us
            </a>
            <a href="/contactUs" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
              Contact 
            </a>
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-teal-600 px-3 py-2"
              title="Profile"
            >
              <FaUserCircle className="text-2xl" />
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNav;