const nunjucks = require('nunjucks');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const path = require('path');

module.exports = (route) => {
  const app = express();

  app.set('view engine', 'html');

  nunjucks.configure([
    path.join(__dirname, '../../../server/views'),
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components/',
  ], {
    autoescape: true,
    express: app,
  });

  app.use((req, res, next) => {
    req.user = {
      firstName: 'first',
      lastName: 'last',
      userId: 'id',
      token: 'token',
      username: 'CA_USER_TEST',
    };
    next();
  });
  app.use(cookieSession({ keys: [''] }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/', route);
  app.use((error, req, res, next) => {
    console.log(error);
  });
  return app;
};
