// Home.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import MenuAppBar from '../components/MenuAppBar';
import NoteCard from '../components/NoteCard';
import FetchedNotes from '../components/FetchedNotes';

export default function Home() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    useEffect(() => {
        // Check for signed-out state on component mount
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSignOut = async () => {
        try {
            await signOut();
            console.log('Successfully signed out');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <div className="relative min-h-screen">
            <MenuAppBar window={() => window} handleSignOut={handleSignOut} />

            <FetchedNotes />
            <div className="md:bg-transparent md:min-h-96 md:flex md:flex-row md:justify-end md:items-end md:absolute md:bottom-0 md:right-0 md:mr-4 md:p-5 flex flex-row justify-end items-end bottom-0 right-0 p-5 fixed">
                <NoteCard />
            </div>
        </div>
    );
}