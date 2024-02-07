import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewFavorites = () => {
        // Redirect the user to /favorites
        navigate('/favorites');
        handleClose();
    };

    return (
        <>
            <Button sx={{ color: 'black' }} onClick={handleViewFavorites}>
                Preferiti
            </Button>
        </>
    );
};

export default FavoriteButton;