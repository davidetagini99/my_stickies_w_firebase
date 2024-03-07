import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

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

    const sanitizedText = DOMPurify.sanitize('Preferiti');

    return (
        <>
            <Button sx={{ color: 'black' }} onClick={handleViewFavorites}>
                {sanitizedText}
            </Button>
        </>
    );
};

export default FavoriteButton;
