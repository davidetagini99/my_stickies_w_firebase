// AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from './firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signInWithGoogle = async () => {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error('Error signing in with Google:', error.message);
        }
    };

    const signOut = async () => {
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};