// Login.jsx
import React from 'react';
import { useAuth } from '../AuthProvider';
import SignInWithGoogleButton from '../components/LoginWithGoogle';
import HomeAppBar from '../components/HomeAppBar';

function Login() {
    const { signInWithGoogle } = useAuth();

    return (
        <div>
            <HomeAppBar />
            <div className="flex items-center justify-center h-screen">
                <SignInWithGoogleButton onSignIn={signInWithGoogle} />
            </div>
        </div>
    );
}

export default Login;