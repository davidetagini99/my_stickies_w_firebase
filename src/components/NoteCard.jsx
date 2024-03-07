import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize, Fab, Slide } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import SaveIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DOMPurify from 'dompurify';
import { useAuth } from '../AuthProvider';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const NoteCard = () => {
    const { user } = useAuth();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('My Stickies');

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
            if (user && note.trim() !== '') {
                const sanitizedNote = DOMPurify.sanitize(note);
                const sanitizedTitle = DOMPurify.sanitize(title);

                // Save the note with the user's ID
                const docRef = await addDoc(collection(db, 'notes'), {
                    content: sanitizedNote,
                    userId: user.uid,
                    timestamp: serverTimestamp(),
                });

                console.log('Note added with ID: ', docRef.id);

                setNote('');
                setTitle('My Stickies');
                closeDialog();
            }
        } catch (error) {
            console.error('Error adding note: ', error);
        }
    };

    return (
        <>
            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <Fab
                    sx={{
                        backgroundColor: '#feff9c', color: 'black', '&:hover': {
                            backgroundColor: 'black', color: 'white'
                        },
                        '&:focus': {
                            backgroundColor: 'black', color: 'white'
                        },
                    }}
                    onClick={openDialog}
                >
                    <AddIcon />
                </Fab>
            </div>
            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                TransitionComponent={Transition}
                sx={{ '& .MuiDialog-paper': { width: '500px', height: 'fit-content' } }}
            >
                <div className='md:bg-transparent md:w-full'>
                    <div className='md:bg-transparent md:flex md:flex-row md:justify-between md:align-middle md:p-2 md:w-full w-full bg-transparent flex flex-row justify-between align-middle p-2' style={{ backgroundColor: '#feff9c' }}>
                        <DialogTitle>{sanitizedTitle}</DialogTitle>
                        <div className=' md:bg-transparent md:flex md:flex-col md:justify-center md:align-middle flex flex-col justify-center align-middle'>
                            <Button sx={{ backgroundColor: 'transparent', height: 'fit-content', width: 'fit-content', textAlign: 'center', paddingLeft: '20px' }} onClick={saveNote} color="primary" startIcon={<SaveIcon sx={{ color: 'black' }} />}></Button>
                        </div>
                    </div>
                    <DialogContent>
                        <TextareaAutosize
                            value={note}
                            onChange={handleNoteChange}
                            aria-label="empty textarea"
                            placeholder="Prendi il tuo appunto qui"
                            className='rounded-lg shadow-xl p-3'
                            style={{
                                width: '100%',
                                marginBottom: '16px',
                                backgroundColor: '#feff9c',
                                border: 'none',
                                resize: 'vertical',
                            }}
                            minRows={10}
                            required={true}
                        />
                    </DialogContent>
                </div>
            </Dialog>
        </>
    );
};

export default NoteCard;
