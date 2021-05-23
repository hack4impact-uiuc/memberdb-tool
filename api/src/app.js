const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const RateLimit = require('express-rate-limit');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const csrf = require("csurf");
const apiRoutes = require('./api');
const { errorHandler } = require('./middleware');
const environment = process.env.NODE_ENV || 'dev';
const app = express();

const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5
});

app.use("/auth/", apiLimiter);

// HTTPS, CORS, bodyParser
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
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
};
if (environment == 'production') {
  app.set('trust proxy', 1);
  sessionConfig.secure = true;
}

app.use(csrf({ cookie: true }));
app.use(cookieSession(sessionConfig));

// Mongo setup
require('./utils/mongo-setup');

// Passport setup
require('./utils/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', apiRoutes);
app.get('/', (req, res) => res.json('API working!'));
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
