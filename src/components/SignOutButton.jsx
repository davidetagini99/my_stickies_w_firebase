import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DOMPurify from 'dompurify';

const SignOutButton = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            const auth = getAuth(app);
            await auth.signOut();
            console.log('Successfully signed out');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmation = () => {
        handleSignOut();
        handleClose();
    };

    const sanitizedButtonText = DOMPurify.sanitize('Disconnetti');
    const sanitizedDialogTitle = DOMPurify.sanitize('My stickies');
    const sanitizedDialogContent = DOMPurify.sanitize('Vuoi disconnetterti?');
    const sanitizedButtonNo = DOMPurify.sanitize('No');
    const sanitizedButtonYes = DOMPurify.sanitize('Si');

    return (
        <>
            <Button sx={{ color: 'black' }} onClick={handleOpen}>
                {sanitizedButtonText}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{sanitizedDialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText dangerouslySetInnerHTML={{ __html: sanitizedDialogContent }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{sanitizedButtonNo}</Button>
                    <Button onClick={handleConfirmation}>{sanitizedButtonYes}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SignOutButton;
