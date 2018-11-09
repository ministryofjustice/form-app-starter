const express = require('express');
const addRequestId = require('express-request-id')();
const helmet = require('helmet');
const csurf = require('csurf');
const compression = require('compression');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const createIndexRouter = require('./routes/index');
const sassMiddleware = require('node-sass-middleware');
const moment = require('moment');
const path = require('path');
const log = require('bunyan-request-logger')();
const logger = require('../log.js');
const nunjucks = require('nunjucks');

const config = require('../server/config');

const version = moment.now().toString();
const production = process.env.NODE_ENV === 'production';
const testMode = process.env.NODE_ENV === 'test';

module.exports = function createApp({ logger, someService }) { // eslint-disable-line no-shadow
  const app = express();

  app.set('json spaces', 2);

  // Configure Express for running behind proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true);

  // View Engine Configuration
  // app.set('views', path.join(__dirname, '../server/views'));
  app.set('view engine', 'html');

  nunjucks.configure([
    path.join(__dirname, '../server/views'),
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components/',
  ], {
    autoescape: true,
    express: app,
  });


  // Server Configuration
  app.set('port', process.env.PORT || 3000);

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  app.use(helmet());

  app.use(addRequestId);

  app.use(cookieSession({
    name: 'session',
    keys: [config.sessionSecret],
    maxAge: 60 * 60 * 1000,
    secure: config.https,
    httpOnly: true,
    signed: true,
    overwrite: true,
    sameSite: 'lax',
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Request Processing Configuration
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(log.requestLogger());

  // Resource Delivery Configuration
  app.use(compression());

  // Cachebusting version string
  if (production) {
    // Version only changes on reboot
    app.locals.version = version;
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = moment.now().toString();
      return next();
    });
  }

  if (!production) {
    app.use('/public', sassMiddleware({
      src: path.join(__dirname, '../assets/sass'),
      dest: path.join(__dirname, '../assets/stylesheets'),
      debug: true,
      outputStyle: 'compressed',
      prefix: '/stylesheets/',
      includePaths: [
        'node_modules/govuk-frontend',
      ],
    }));
  }

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration * 1000 };

  [
    '../assets',
    '../assets/stylesheets',
    '../node_modules/govuk-frontend/assets',
    '../node_modules/govuk-frontend',
  ].forEach((dir) => {
    app.use('/assets', express.static(path.join(__dirname, dir), cacheControl));
  });

  [
    '../node_modules/govuk_frontend_toolkit/images',
  ].forEach((dir) => {
    app.use('/assets/images/icons', express.static(path.join(__dirname, dir), cacheControl));
  });

  // GovUK Template Configuration
  app.locals.asset_path = '/assets/';

  function addTemplateVariables(req, res, next) {
    res.locals.user = req.user;
    next();
  }

  app.use(addTemplateVariables);

  // Don't cache dynamic resources
  app.use(helmet.noCache());

  // CSRF protection
  if (!testMode) {
    app.use(csurf());
  }

  // Routing
  app.use('/', createIndexRouter({ logger, someService }));

  app.use(renderErrors);

  return app;
};


function renderErrors(error, req, res, next) { // eslint-disable-line no-unused-vars
  logger.error(error);

  // code to handle unknown errors

  res.locals.error = error;
  res.locals.stack = production ? null : error.stack;
  res.locals.message = production ?
    'Something went wrong. The error has been logged. Please try again' : error.message;

  res.status(error.status || 500);

  res.render('pages/error');
}
