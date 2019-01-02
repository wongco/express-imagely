const express = require('express');
const app = express();
// uncomment below to use morgan for basic logging
const morgan = require('morgan');

// allow express to parse JSON
app.use(express.json());
// Parse request bodies for JSON
app.use(express.urlencoded({ extended: true }));

// log items to console using morgan - optional enable
app.use(morgan('tiny'));

const imagesRoutes = require('./routes/images');

// routing control
app.use('/images', imagesRoutes);

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
