const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

JWT_SECRET = 'Heil卐Hitler';

// ROUTE 1 :- Create a user using: POST "/api/auth/createuser" . Login not required

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Invalid password').isLength({ min: 5 }),

    // validations have been imposed with the help of express-validator 

], async (req, res) => {
    let success = false;
    // if there are errors, return Bad Request and the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    // check whethere the email exists already

    try {

        // this will be async hence the await keyword is used here

        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // create a new user and displays a welcome text

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({ success,authToken });

        // res.send(`Welcome ${req.body.name}`);
        // catching errors (especially internal server errors)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Oops, Something Went Wrong!')
    }
});

// ROUTE 2 :- Authenticate a user using: POST "/api/auth/login" . Login not required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // if there are errors, return Bad Request and the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Please enter with the correct credentials' });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            success=false;
            return res.status(400).json({success, error: 'Please enter with the correct credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        const success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Oops, Something Went Wrong!');
    }
});


// ROUTE 3 :- Get loggedin User details via : POST "/api/auth/getuser" . Login required


// the fetchuser middleware will be executed in those routes only where user needs to login to access their details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // this will select all fields under the given id except the password
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Oops, Something Went Wrong!');
    }
});













module.exports = router;