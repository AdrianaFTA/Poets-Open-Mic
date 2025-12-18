import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    
    // Retrieve user data stored during login
    const user = JSON.parse(localStorage.getItem('user')) || { username: 'Poet' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <div className="border-t border-gray-200 pt-4">
                <p className="text-lg"><strong>Username:</strong> {user.username}</p>
                <p className="text-gray-500 text-sm mt-2">Welcome back to the Poets Open Mic!</p>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;