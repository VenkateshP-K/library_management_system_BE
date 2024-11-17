const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./Routes/userRoutes');
const bookRouter = require('./Routes/bookRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

app.get('/api', (req, res) => {
    res.send('Hello World!');
});


module.exports = app;