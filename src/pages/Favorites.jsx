// Favorites.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import FavoriteNotes from '../components/FavoriteNotes';
import MenuAppBar from '../components/MenuAppBar';

export default function Favorites() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // Check for signed-out state on component mount
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div>
            <div>
                <MenuAppBar />
            </div>
            <div>
                <FavoriteNotes />
            </div>
        </div>
    );
}