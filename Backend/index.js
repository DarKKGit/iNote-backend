const connectToMongo = require('./db');
connectToMongo();
// connecting to mongodb database, and it is operated using the Mongodb compass
const express = require('express')
const cors = require('cors');
const app = express();
const port = 5000;
// 5000 has been used as the react app for the frontend will be run on port 3000

app.use(express.json());
app.use(cors());
// endpoints created to be hit , and these therefore require different route files (like auth.js and notes.js)
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));





app.listen(port, ()=>{
    console.log(`iNote App Listening on http://localhost:${port}`)
})