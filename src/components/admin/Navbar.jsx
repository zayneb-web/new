import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Your logo or brand name */}
              <span className="text-white text-xl font-bold">Admin Panel</span>
            </div>
            {/* Navigation links */}
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:border-white">Dashboard</Link>
              <Link to="/users" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:border-white">Users</Link>
              {/* Add more links as needed */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;