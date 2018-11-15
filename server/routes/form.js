const express = require('express');
const { getIn } = require('../utils/functionalHelpers');
const { getPathFor } = require('../utils/routes');
const formConfig = require('../config/section1');
const getFormData = require('../middleware/getFormData');
const asyncMiddleware = require('../middleware/asyncMiddleware');

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

  router.get('/', (req, res) => {
    const data = 'Some data';

    res.render('pages/index', { data });
  });

  router.get('/:section/:form', asyncMiddleware(async (req, res) => {
    const { section, form } = req.params;

    const pageData = getIn([section, form], res.locals.formObject);

    res.render(`formPages/${section}/${form}`, { data: pageData });
  }));

  router.post('/:section/:form', asyncMiddleware(async (req, res) => {
    const { section, form } = req.params;

    await formService.update({
      userId: 'user1',
      formId: res.locals.formId,
      formObject: res.locals.formObject,
      config: formConfig[form],
      userInput: req.body,
      formSection: section,
      formName: form,
    });

    const nextPath = getPathFor({ data: req.body, config: formConfig[form] });
    res.redirect(`${nextPath}`);
  }));

  return router;
};
