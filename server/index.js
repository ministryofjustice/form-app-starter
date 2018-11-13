const createApp = require('./app');
const logger = require('../log');

const formClient = require('./data/formClient');
const createFormService = require('./services/formService');

// pass in dependencies of service
const formService = createFormService(formClient);

const app = createApp({
  logger,
  formService,
});

module.exports = app;
