import React from 'react';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Button from '@mui/material/Button';

const SignOutButton = () => {
    const navigate = useNavigate(); // Use useNavigate for navigation

    const handleSignOut = async () => {
        try {
            const auth = getAuth(app); // Get auth instance from app
            await auth.signOut();
            console.log('Successfully signed out');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <Button sx={{ color: 'black' }} onClick={handleSignOut}>
            Disconnetti
        </Button>
    );
};

export default SignOutButton;