import React, { useState } from 'react';
import { Button, Menu, MenuItem, Avatar } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import SignOutButton from './SignOutButton';
import FavoriteButton from './FavoriteButton'; // Import your FavoriteButton component

const ProfileDropdown = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        auth.signOut();
        handleClose();
        navigate('/');
    };

    return (
        <>
            <Button onClick={handleClick}>
                <Avatar alt="User Avatar" src={user?.photoURL} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {/* Use the FavoriteButton component here */}
                <MenuItem>
                    <FavoriteButton />
                </MenuItem>

                <MenuItem>
                    <SignOutButton handleSignOut={handleSignOut} />
                </MenuItem>
            </Menu>
        </>
    );
};

export default ProfileDropdown;