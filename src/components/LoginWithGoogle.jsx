import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../firebase';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const SignInWithGoogleButton = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Google login successful', user);

            // Sanitize user object
            const sanitizedUser = DOMPurify.sanitize(user);
            console.log('Sanitized user:', sanitizedUser);

            // You can sanitize other text content as needed
            const buttonText = 'Accedi con Google';
            const sanitizedButtonText = DOMPurify.sanitize(buttonText);

            console.log('Sanitized button text:', sanitizedButtonText);

            // You can add further logic like redirecting or updating state on successful login
            navigate('/home');
        } catch (error) {
            console.error('Error during Google login', error.message);
        }
    };

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
