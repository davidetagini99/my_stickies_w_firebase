import React, { useState, useEffect } from 'react';
import {
    onSnapshot,
    collection,
    query,
    where,
    updateDoc,
    doc
} from 'firebase/firestore';
import { db } from '../firebase';
import {
    TextareaAutosize,
    Paper,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../AuthProvider';

const FavoriteNotes = () => {
    const { user } = useAuth();
    const [favoriteNotes, setFavoriteNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (!user) return;

        const userId = user.uid;

        const favoriteNotesQuery = query(
            collection(db, 'notes'),
            where('isFavorite', '==', true),
            where('userId', '==', userId)
        );

        const unsubscribe = onSnapshot(favoriteNotesQuery, (snapshot) => {
            const newFavoriteNotes = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setFavoriteNotes(newFavoriteNotes);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, [user]);

    const handleDeleteNote = async (noteId) => {
        setSelectedNote(noteId);
        setOpenModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Update the note in Firestore to mark it as not favorite
            await updateDoc(doc(db, 'notes', selectedNote), {
                isFavorite: false
            });

            setOpenModal(false);
        } catch (error) {
            console.error('Error updating note: ', error);
        }
    };

    const handleCancelDelete = () => {
        setSelectedNote(null);
        setOpenModal(false);
    };

    return (
        <div>
            <div className='md:bg-transparent md:hidden md:flex-row md:justify-start md:align-middle hidden flex-row justify-center align-middle flex-wrap bg-transparent p-3'>
                <Typography variant='h5' gutterBottom>
                    Note preferite
                </Typography>
            </div>

            <div className='md:bg-transparent md:flex md:flex-row md:justify-start md:align-middle flex-wrap bg-transparent flex flex-row justify-center align-middle'>
                {favoriteNotes.map((note) => (
                    // Check if the note's userId matches the current user's userId
                    (
                        note.userId === user.uid && (
                            <Paper
                                key={note.id}
                                elevation={3}
                                style={{
                                    position: 'relative',
                                    margin: '16px',
                                    padding: '16px',
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none',
                                }}
                            >
                                <TextareaAutosize
                                    readOnly
                                    className='md:w-60 md:h-60 border-none resize rounded-lg p-4 shadow-xl cursor-pointer'
                                    style={{ backgroundColor: '#feff9c' }}
                                    value={note.content}
                                    minRows={7}
                                />
                                <IconButton
                                    aria-label='delete'
                                    onClick={() => handleDeleteNote(note.id)}
                                    style={{
                                        position: 'absolute',
                                        bottom: '25px',
                                        right: '18px',
                                        zIndex: 1,
                                        color: 'black',
                                    }}
                                >
                                    {note.isFavorite ? (
                                        <span style={{ color: 'red' }}><FavoriteIcon /></span>
                                    ) : null}
                                </IconButton>
                            </Paper>
                        )
                    )
                ))}

            </div>

            <Dialog open={openModal} onClose={handleCancelDelete}>
                <DialogTitle>My stickies</DialogTitle>
                <DialogContent>
                    <Typography>Vuoi togliere questa nota dai preferiti?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>No</Button>
                    <Button onClick={handleConfirmDelete}>Sì</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FavoriteNotes;
