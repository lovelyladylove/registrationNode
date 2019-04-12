//add mongoose
const mongoose = require ('mongoose');
const Schema = mongoose.Schema; 

const userSchema = new Schema({
    email: { type: String},
    username: { 
        firstname: String,
        lastname: String
    },
    password: {type: String},
    website: {type: String},
    location: {
        street: String,
        zip: Number,
        country: String
    }
});

const User = mongoose.model('User', userSchema );

module.exports = User; 

