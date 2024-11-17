const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : Number,
        required : true,
        unique : true
    },
    location : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    rentedBooks : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Book'
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;