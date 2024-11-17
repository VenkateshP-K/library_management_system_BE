const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const auth = require('../auth');

userRouter.post('/register', userController.Register);
userRouter.post('/login', userController.LogIn);
userRouter.post('/logout', auth.isAuth, userController.Logout);
userRouter.get('/me', auth.isAuth, userController.GetMe);
userRouter.get('/rentedBooks', auth.isAuth, userController.rentedBooks);
userRouter.get('/getAllUsers', auth.isAuth, auth.isAdmin, userController.getAllUsers);
userRouter.put('/updateUser', auth.isAuth, userController.updateUser);

module.exports = userRouter;