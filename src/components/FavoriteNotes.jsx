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
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../AuthProvider';
import DOMPurify from 'dompurify';

const FavoriteNotes = () => {
    const { user } = useAuth();
    const [favoriteNotes, setFavoriteNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openNoteModal, setOpenNoteModal] = useState(false);
    const [selectedNoteContent, setSelectedNoteContent] = useState('');

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
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Update the note in Firestore to mark it as not favorite
            await updateDoc(doc(db, 'notes', selectedNote), {
                isFavorite: false
            });

            setOpenDeleteModal(false);
        } catch (error) {
            console.error('Error updating note: ', error);
        }
    };

    const handleCancelDelete = () => {
        setSelectedNote(null);
        setOpenDeleteModal(false);
    };

    const handleOpenNoteModal = (noteContent) => {
        setSelectedNoteContent(noteContent);
        setOpenNoteModal(true);
    };

    const handleCloseNoteModal = () => {
        setSelectedNoteContent('');
        setOpenNoteModal(false);
    };

    return (
        <div>
            <div className='md:bg-transparent md:hidden md:flex-row md:justify-start md:align-middle hidden flex-row justify-center align-middle flex-wrap bg-transparent p-3'>
                <Typography variant='h5' gutterBottom>
                    {DOMPurify.sanitize('Note preferite')}
                </Typography>
            </div>

            <div className='md:bg-transparent md:flex md:flex-row md:justify-start md:align-middle flex-wrap bg-transparent flex flex-row justify-center align-middle'>
                {favoriteNotes.map((note) => (
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
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <TextareaAutosize
                                readOnly
                                className={`note-textarea-${note.id} md:w-60 md:h-60 border-none resize rounded-lg p-4 shadow-xl cursor-pointer`}
                                style={{ backgroundColor: '#feff9c', resize: 'none' }}
                                value={DOMPurify.sanitize(note.content.split(' ').slice(0, 3).join(' '))}
                                minRows={7}
                                onClick={() => handleOpenNoteModal(note.content)}
                            />
                            <IconButton
                                aria-label='favorite'
                                onClick={() => handleDeleteNote(note.id)}
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '20px',
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
                ))}
            </div>

            <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
                <DialogTitle>{DOMPurify.sanitize('My stickies')}</DialogTitle>
                <DialogContent>
                    <Typography>{DOMPurify.sanitize('Vuoi togliere questa nota dai preferiti?')}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>{DOMPurify.sanitize('No')}</Button>
                    <Button onClick={handleConfirmDelete}>{DOMPurify.sanitize('Sì')}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openNoteModal} onClose={handleCloseNoteModal}>
                <DialogActions>
                    <IconButton aria-label="close" onClick={handleCloseNoteModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    <Typography>{DOMPurify.sanitize(selectedNoteContent)}</Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FavoriteNotes;
