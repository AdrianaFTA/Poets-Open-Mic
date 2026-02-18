import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserPoems, deletePoem } from "../services/poemService";

const Profile = () => {
    const navigate = useNavigate();
    const [poems, setPoems] = useState([]); 
    const user = JSON.parse(localStorage.getItem('user')) || { username: 'Poet' };
    const token = localStorage.getItem('token');

    const loadPoems = () => {
        if (token) {
            getUserPoems(token)
                .then(data => setPoems(data))
                .catch(err => console.error("I couldn't load the poems:", err));
        }
    };

    useEffect(() => {
        loadPoems();
    }, [token]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this poem forever?")) {
            await deletePoem(id, token);
            // I'm refreshing the list after the delete is successful
            loadPoems();
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6 mt-10 text-gray-900">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <div className="border-t border-gray-200 pt-4">
                <p className="text-lg"><strong>Username:</strong> {user.username}</p>
            </div>

            {/* I've split this into two sections: Drafts and Published */}
            {['draft', 'published'].map((status) => (
                <div key={status} className="mt-6">
                    <h2 className="text-xl font-semibold border-b pb-2 capitalize">Your {status}s</h2>
                    <div className="mt-4 space-y-2">
                        {poems.filter(p => p.status === status).length > 0 ? (
                            poems.filter(p => p.status === status).map(poem => (
                                <div key={poem.id} className="p-3 bg-gray-100 rounded flex justify-between items-center">
                                    <span className="font-medium">{poem.title || "Untitled"}</span>
                                    <div className="flex gap-4">
                                        <Link to={`/write/${poem.id}`} className="text-blue-600 font-bold text-sm">Edit</Link>
                                        <button 
                                            onClick={() => handleDelete(poem.id)} 
                                            className="text-red-600 font-bold text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-sm">No {status}s found.</p>
                        )}
                    </div>
                </div>
            ))}

            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full bg-red-500 text-white p-2 rounded mt-6">
                Logout
            </button>
        </div>
    );
};

export default Profile;