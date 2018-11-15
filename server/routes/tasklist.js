const express = require('express');
const { getIn } = require('../utils/functionalHelpers');
const getFormData = require('../middleware/getFormData');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const logger = require('../../log');


module.exports = function Index({ formService, authenticationMiddleware }) {
  const router = express.Router();

  router.use(authenticationMiddleware());
  router.use(getFormData(formService));

  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken();
    }
    next();
  });

  router.get('/', asyncMiddleware(async (req, res) => {
    res.render('pages/tasklist', { data: res.locals.formObject });
  }));

  return router;
};
