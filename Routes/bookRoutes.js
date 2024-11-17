const express = require('express');
const bookRouter = express.Router();
const bookController = require('../controller/bookController');
const auth = require('../auth');

bookRouter.get('/getAllBooks', auth.isAuth, bookController.getAllBooks);
bookRouter.get('/getRentedBooks', auth.isAuth,auth.isAdmin, bookController.getAllRentedBooks);
bookRouter.get('/getBook/:bookId', auth.isAuth, bookController.getBookById);
bookRouter.post('/createBook', auth.isAuth, auth.isAdmin, bookController.createBook);
bookRouter.delete('/deleteBook/:bookId', auth.isAuth, auth.isAdmin, bookController.deleteBook);
bookRouter.put('/rentBook/:bookId', auth.isAuth, bookController.rentBook);
bookRouter.put('/returnBook/:bookId', auth.isAuth, bookController.returnBook);
bookRouter.get('/allRentedBooks', auth.isAuth, auth.isAdmin, bookController.booksRentedByAllUsers);

module.exports = bookRouter;