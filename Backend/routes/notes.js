const express = require('express');
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1 :- Get all Notes via : GET "/api/notes/fetchallnotes" . Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Oops, Something Went Wrong!');
    }
});


// ROUTE 2 :- Add a new note via : POST "/api/notes/addnote" . Login required

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description cannot be less than 5 characters').isLength({ min: 5 }),

    // validations have been imposed with the help of express-validator 

], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        // if there are errors, return Bad Request and the error
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const savedNote = await Notes.create({ title, description, tag, user: req.user.id })
        res.json(savedNote)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Oops, Something Went Wrong!');
    }
});

// ROUTE 3 :- Update a Note via : PUT "/api/notes/updatenote" . Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try{

    
    const { title, description, tag } = req.body;

    // create a new note object

    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    // find the note to be updated and update it

    let note = await Notes.findById(req.params.id) // this is that id which is mentioned in /addnote/:id
    console.log(note);
    if (!note) {
        return res.status(404).send('Not Found')
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send('Access Denied')
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json(note);
}catch(error){
    console.error(error.message);
    res.status(500).send('Oops, Something Went Wrong!'); 
}
});


// ROUTE 4 :- Delete a Note via : DELETE "/api/notes/deletenote" . Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try{

    
    const { title, description, tag } = req.body;

    // find the note to be deleted and delete it

    let note = await Notes.findById(req.params.id) // this is that id which is mentioned in /addnote/:id
    console.log(note);
    if (!note) {
        return res.status(404).send('Not Found')
    }

    // Allow deletion only if user owns this note

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send('Access Denied')
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success":"Your note has been deleted"});
}catch(error){
    console.error(error.message);
    res.status(500).send('Oops, Something Went Wrong!'); 
}
});

module.exports = router;