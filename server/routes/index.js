const express = require('express');

module.exports = function Index({ logger, someService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const data = someService.getSomeData();

    res.render('pages/index', { data });
  });

  router.get('/:section/:form', (req, res) => {
    const {section, form} = req.params;

    res.render('formPages/formTemplate');
  });

  return router;
};
