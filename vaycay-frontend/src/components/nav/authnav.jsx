import { useNavigate } from 'react-router-dom';

const AuthNav = ({ handleLogout }) => {
  return (
    <nav className="bg-beige-600 shadow-md">
      <div className="py-4 pl-12 pr-4 sm:pl-16 sm:pr-6 lg:pl-24 lg:pr-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <img className="h-16 w-auto" src="/src/assets/logo.png" alt="Vacay Logo" />
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="/hotels" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
              Recommended Hotels
            </a>
            <a href="/about" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
              About us
            </a>
            <a href="/contact" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
              Contact
            </a>
            <button onClick={handleLogout} className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNav;