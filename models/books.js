const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    isRented : {
        type : Boolean,
        default : false
    },
    rentedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book