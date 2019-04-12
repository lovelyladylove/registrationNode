
const mongoose = require ('mongoose');
const Schema = mongoose.Schema; 

const bookSchema = new Schema({
    title: { type: String, required: true},
    author: { type: String},
    published: { type: Date},
    language: { type: String},
    description: { type: String},
    updatedDate: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema );

module.exports = Book; 