import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize, Fab } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import SaveIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DOMPurify from 'dompurify';
import { useAuth } from './AuthProvider';

const NoteCard = () => {
    const { user } = useAuth();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [note, setNote] = useState('');

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const saveNote = async () => {
        try {
            if (user) {
                const sanitizedNote = DOMPurify.sanitize(note);

                // Save the note with the user's ID
                const docRef = await addDoc(collection(db, 'notes'), {
                    content: sanitizedNote,
                    userId: user.uid,
                    timestamp: serverTimestamp(),
                });

                console.log('Note added with ID: ', docRef.id);

                setNote('');
                closeDialog();
            }
        } catch (error) {
            console.error('Error adding note: ', error);
        }
    };

    return (
        <>
            <Fab
                style={{ backgroundColor: '#feff9c', color: 'black' }}
                onClick={openDialog}
            >
                <AddIcon />
            </Fab>
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <div className='md:bg-transparent md:w-full'>
                    <div className='md:bg-transparent md:flex md:flex-row md:justify-between md:align-middle md:p-2 md:w-96 w-72 bg-transparent flex flex-row justify-between align-middle p-2' style={{ backgroundColor: '#feff9c' }}>
                        <DialogTitle>My Stickies</DialogTitle>
                        <Button onClick={saveNote} color="primary" startIcon={<SaveIcon sx={{ color: 'black' }} />}>
                            Save
                        </Button>
                    </div>
                    <DialogContent>
                        <TextareaAutosize
                            value={note}
                            onChange={handleNoteChange}
                            aria-label="empty textarea"
                            placeholder="Write your note here..."
                            className='rounded-lg shadow-xl p-3'
                            style={{
                                width: '100%',
                                marginBottom: '16px',
                                backgroundColor: '#feff9c',
                                border: 'none',
                                resize: 'both',
                            }}
                            minRows={10}
                        />
                    </DialogContent>
                </div>
            </Dialog>
        </>
    );
};

export default NoteCard;
