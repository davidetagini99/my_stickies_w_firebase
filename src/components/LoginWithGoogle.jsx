import React, { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import app from '../firebase';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const SignInWithGoogleButton = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Google login successful', user);

            // You can sanitize user object if needed
            // const sanitizedUser = DOMPurify.sanitize(user);
            // console.log('Sanitized user:', sanitizedUser);

            // You can add further logic like redirecting or updating state on successful login
            navigate('/home');
        } catch (error) {
            console.error('Error during Google login', error.message);
        }
    };

    // Redirect to home if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Button
            variant="contained"
            onClick={handleGoogleLogin}
            sx={{
                backgroundColor: '#feff9c', color: 'black', padding: '9px', minWidth: '14vw', textTransform: 'lowercase', '&:hover': {
                    backgroundColor: 'black', color: 'white'
                },
                '&:focus': {
                    backgroundColor: 'black', color: 'white'
                },
            }}
        >
            {DOMPurify.sanitize('Accedi con Google')}
        </Button>
    );
};

export default SignInWithGoogleButton;
