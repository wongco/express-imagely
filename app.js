const express = require('express');
const app = express();
const helmet = require('helmet');
const validHTTPMethods = require('./helpers/validHTTPMethods');

// don't provide http logging during automated tests
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
  // middleware for logging HTTP requests to console
  const morgan = require('morgan');
  app.use(morgan('tiny'));
}

// allow cross origin
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// allow large payload (iphone picture)
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// routes
const imagesRoutes = require('./routes/images');

// allow express to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable header protection using helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"]
      }
    },
    referrerPolicy: { policy: 'no-referrer' }
  })
);

// routing control
app.use('/images', imagesRoutes);

// restrict http methods on any undefined routes
app.use(validHTTPMethods(['GET']));

/** 404 catch all */
app.use((req, res, next) => {
  const error = new Error('Resource could not be found.');
  error.status = 404;
  return next(error);
});

/** error handler */
app.use((err, req, res, next) => {
  // the default status is 500 Internal SVR Error if status code was unset
  const status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status
    }
  });
});

module.exports = app;
