const createError = require('http-errors');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const routes = require('./routes');

const app = express();
const { errorHandler } = require('./middleware');

const environment = process.env.NODE_ENV || 'dev';
if (environment != 'production') {
  dotenv.config({
    path: path.resolve(__dirname, `../config/${environment}.env`),
  });
}

// CONNECTION TO MONGO
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', (error) => console.log('Error connecting to MongoLab:', error));

app.use(helmet());
if (environment != 'production') {
  // For authentication to work on CORS, we must specify a non-wildcard origin
  // and allow credentials (cookies)
  app.use(cors({ origin: /localhost:\d{4}/, credentials: true }));
}

app.use(logger('dev'));

app.use(bodyParser.json({ limit: '2.1mb' }));
app.use(bodyParser.urlencoded({ limit: '2.1mb', extended: false }));

// Session support, needed for authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false,
  }),
);

// Passport setup
require('./utils/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.get('/', (req, res) => res.json('API working!'));

app.get('/favicon.ico', (req, res) => res.status(204));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
