import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Poets Open Mic</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/editor" className="hover:text-gray-300">Write</Link>
        <Link to="/profile" className="hover:text-gray-300">Profile</Link>
      </div>
    </nav>
  );
};

export default Header;