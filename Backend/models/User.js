const mongoose = require('mongoose');
const { Schema } = mongoose;
// creating a schema which will later be exported
const UserSchema = new Schema ({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
    
});
const User =  mongoose.model('user',UserSchema);
module.exports = User;