const { get } = require("http");
const config = require("../config");
const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    Register: async (req, res) => {
        try {
            const { userName, email, password, phoneNumber, location } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 'message': 'User already exists' });
            }

            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = await User.create({
                userName,
                email,
                password : passwordHash,
                phoneNumber,
                location
            });

            return res.status(200).json({ 'message': 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    LogIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: "Unauthorized User" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("Password validity:", isPasswordValid);
  
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign({ userId: user._id }, config.JWT_SECRET);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,  // Token expiry: 1 day
            });

            res.status(200).json({
                message: 'Logged in successfully',
                user,
                token,
                userName: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                location: user.location
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    GetMe: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error in getMe:', error);
            res.status(500).json({ message: error.message });
        }
    },

    Logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Error in logout:', error);
            res.status(500).json({ message: error.message });
        }
    },

    rentedBooks: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const rentedBooks = user.rentedBooks;
            res.status(200).json({ rentedBooks });
        } catch (error) {
            console.error('Error in rentedBooks:', error);
            res.status(500).json({ message: error.message });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({ users });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({ message: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error in updateMe:', error);
            res.status(500).json({ message: error.message });
        }
    },
}

module.exports = userController;