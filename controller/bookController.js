const { get } = require("mongoose");
const Book = require("../models/books");
const User = require("../models/users");
const { getAllUsers } = require("./userController");

const bookController = {
    createBook : async (req, res) => {
        try {
            const {title,author,description} = req.body;
            
            const newBook = new Book({
                title,
                author,
                description
            })

            const savedBook = await newBook.save();
            res.status(200).json({message : "Book created successfully", savedBook});
        } catch (error) {
            console.error('Error in createBook:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getAllBooks : async (req, res) => {
        try {
            const books = await Book.find();
            res.status(200).json({books});
        } catch (error) {
            console.error('Error in getAllBooks:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getBookById : async (req, res) => {
        try {
            const {bookId} = req.params;
            const book = await Book.findById(bookId);

            if(!book) {
                return res.status(404).json({message : "Book not found"});
            }

            res.status(200).json({book});
        } catch (error) {
            console.error('Error in getBookById:', error);
            res.status(500).json({ message: error.message });
        }
    },

    rentBook : async (req, res) => {
        try {
          const bookId = req.params.bookId;
          const userId = req.userId;
      
          // Find the book
          const book = await Book.findById(bookId);
      
          if (!book) {
            return res.status(404).json({ message: "Book not found" });
          }
      
          // Check if the book is already rented
          if (book.isRented) {
            return res.status(400).json({ message: "Book is already rented" });
          }
      
          // Mark the book as rented
          book.isRented = true;
          book.rentedBy = userId; // Add user to the rentedBy field
          await book.save();
      
          // Add the book to the user's rentedBooks array
          await User.findByIdAndUpdate(userId, {
            $push: { rentedBooks: bookId },
          });
      
          res.status(200).json({ message: "Book rented successfully", book });
        } catch (error) {
          console.error("Error in rentBook:", error);
          res.status(500).json({ message: error.message });
        }
      },

    returnBook : async(req, res) => {
        try{
            const bookId = req.params.bookId
            const userId = req.userId

            const book = await Book.findById(bookId);
            if(book.isRented === false) {
                return res.status(400).json({message : "Book is not rented"});    
            }

            const updateBook = await Book.findByIdAndUpdate(
                bookId,
                {isRented : false},
                {new : true}
            )            

            await Book.findByIdAndUpdate(            
                bookId,
                {$pull : {rentedBy : userId}}            
            )

            await User.findByIdAndUpdate(
                userId,            
                {$pull : {rentedBooks : bookId}}            
            )

            res.status(200).json({message : "Book returned successfully", updateBook});
        } catch (error) {
            console.error('Error in returnBook:', error);
            res.status(500).json({ message: error.message });
        }
    },

    deleteBook : async(req, res) => {
        try {
            const bookId = req.params.bookId
            const book = await Book.findByIdAndDelete(bookId);
            res.status(200).json({message : "Book deleted successfully", book});
        } catch (error) {
            console.error('Error in deleteBook:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getRentedBooks : async(req, res) => {
        try {
            const user = await User.findById(req.userId).populate('rentedBooks');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
            res.status(200).json({rentedBooks : user.rentedBooks});
        } catch (error) {
            console.log('Error in getRentedBooks:', error);
            res.status(500).json({ message: error.message });
        }
    },

    booksRentedByAllUsers : async (req, res) => {
        try {
          const allRentedBooks = await Book.find({ isRented: true }).populate('rentedBy', 'userName phoneNumber');
          res.status(200).json({ allRentedBooks });
        } catch (error) {
          console.error('Error in booksRentedByAllUsers:', error);
          res.status(500).json({ message: error.message });
        }
      }
}

module.exports = bookController;