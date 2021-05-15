const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const authenticate = require('./middlewares/authenticate');
require('dotenv').config();
require('jade');

const productRouter = require('./routes/productsRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/ordersRouter');
const productCollectionRouter = require('./routes/productCollectionsRouter');

const app = express();

// Connect to MongoDB
const connect = mongoose.connect(process.env.MONGODB_URL, {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
});
connect.then(
  () => console.log('Successfully connected to the MongoDB server'),
  (err) => console.log(err),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('etag');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
require('./middlewares/jwt')(passport);

app.use('/api/auth', authRouter);
app.use('/api/user', authenticate, userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/collections', productCollectionRouter);

module.exports = app;
