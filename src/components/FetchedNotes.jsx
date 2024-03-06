import React, { useState, useEffect } from 'react';
import {
    onSnapshot,
    collection,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
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
    Slide,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DOMPurify from 'dompurify';
import { useAuth } from '../AuthProvider';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FetchedNotes = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editedNote, setEditedNote] = useState('');
    const [dialogTextareaHeight, setDialogTextareaHeight] = useState('auto');
    const [isEditing, setIsEditing] = useState(false);

    const handleDialogTextareaInput = (event) => {
        const currentHeight = event.target.scrollHeight;
        setDialogTextareaHeight(currentHeight);
    };

    const handleDialogTextareaClick = () => {
        setIsEditing(true);
        setDialogTextareaHeight('auto'); // Reset height to auto when editing starts
    };

    const handleDialogTextareaBlur = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        if (user) {
            const notesCollection = collection(db, 'notes');
            const userNotesCollection = query(notesCollection, where('userId', '==', user.uid));

            const unsubscribe = onSnapshot(userNotesCollection, (snapshot) => {
                const newNotes = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setNotes(newNotes);
            });

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        }
    }, [user]);

    const handleDeleteNote = async (noteId) => {
        setSelectedNote(noteId);
        setOpenModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Delete the note from Firestore
            await deleteDoc(doc(db, 'notes', selectedNote));
            setOpenModal(false);
        } catch (error) {
            console.error('Error deleting note: ', error);
        }
    };

    const handleCancelDelete = () => {
        setSelectedNote(null);
        setOpenModal(false);
    };

    const handleToggleFavorite = async (noteId, isFavorite) => {
        try {
            // Toggle the favorite status in Firestore
            const noteRef = doc(db, 'notes', noteId);
            await updateDoc(noteRef, {
                isFavorite: !isFavorite,
            });
        } catch (error) {
            console.error('Error toggling favorite status: ', error);
        }
    };

    const handleEditNote = async () => {
        try {
            // Update the note content in Firestore
            const noteRef = doc(db, 'notes', selectedNote);
            await updateDoc(noteRef, {
                content: editedNote,
            });
            setOpenModal(false);
        } catch (error) {
            console.error('Error editing note: ', error);
        }
    };

    const openNoteModal = (noteId, content) => {
        setSelectedNote(noteId);
        setEditedNote(content);
        setOpenModal(true);
    };

    return (
        <div>
            <div className='md:bg-transparent md:hidden md:flex-row md:justify-start md:align-middle flex-wrap bg-transparent p-3 md:py-0 hidden flex-row justify-center align-middle'>
                <Typography variant='h5' gutterBottom>
                    Le tue note
                </Typography>
            </div>

            <div className='md:bg-transparent md:flex md:flex-row md:justify-start md:align-middle md:py-0 flex-wrap bg-transparent flex flex-row justify-center align-middle'>
                {notes.map((note) => (
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
                        {note.userId === user.uid && (
                            <div style={{ position: 'relative' }}>
                                <TextareaAutosize
                                    readOnly
                                    className='md:w-60 md:h-60 border-none resize-none rounded-lg p-4 shadow-xl cursor-pointer'
                                    style={{ backgroundColor: '#feff9c' }}
                                    value={DOMPurify.sanitize(
                                        note.content.split(' ').length >= 3
                                            ? note.content.split(' ').slice(0, 3).join(' ') + '...'
                                            : note.content
                                    )}
                                    minRows={7}
                                    onClick={() => openNoteModal(note.id, note.content)}
                                />
                                <IconButton
                                    aria-label='favorite'
                                    onClick={() =>
                                        handleToggleFavorite(
                                            note.id,
                                            note.isFavorite
                                        )
                                    }
                                    disabled={note.isFavorite}
                                    style={{
                                        position: 'absolute',
                                        bottom: '25px',
                                        right: '18px',
                                        zIndex: 1,
                                        color: note.isFavorite ? 'red' : 'black',
                                        opacity: note.isFavorite ? 0.5 : 1,
                                    }}
                                >
                                    {note.isFavorite ? (
                                        <FavoriteIcon />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )}
                                </IconButton>
                            </div>
                        )}
                    </Paper>
                ))}
            </div>

            <Dialog
                open={openModal}
                onClose={handleCancelDelete}
                TransitionComponent={Transition}
                sx={{ '& .MuiDialog-paper': { width: '500px', height: 'fit-content' } }}
            >
                <div className='md:bg-transparent md:flex md:flex-row md:justify-between md:align-middle md:p-2 flex flex-row justify-between align-middle p-2' style={{ backgroundColor: '#feff9c' }}>
                    <DialogTitle>My stickies</DialogTitle>
                    <IconButton
                        aria-label='edit'
                        onClick={() => setIsEditing(true)}
                        style={{
                            color: 'black',
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </div>
                <DialogContent>
                    {/* Apply slice effect to the textarea inside DialogContent */}
                    <TextareaAutosize
                        readOnly={!isEditing}
                        className='md:w-60 md:h-60 w-60 h-60 border-none resize rounded-lg p-4 shadow-xl cursor-pointer'
                        style={{
                            backgroundColor: '#feff9c',
                            height: isEditing ? 'auto' : dialogTextareaHeight,
                            resize: 'both',
                            overflow: 'scroll',
                            overflowX: 'hidden',
                        }}
                        value={DOMPurify.sanitize(
                            isEditing
                                ? editedNote
                                : editedNote.split(' ').slice(0, 3).join(' ') +
                                (editedNote.split(' ').length > 3 ? '...' : '')
                        )}
                        minRows={7}
                        onChange={(e) => setEditedNote(e.target.value)}
                        onInput={handleDialogTextareaInput}
                        onClick={handleDialogTextareaClick}
                        onBlur={handleDialogTextareaBlur}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#feff9c' }}>
                    <IconButton onClick={handleConfirmDelete} style={{ color: 'black' }}>
                        <DeleteIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FetchedNotes;
