require('dotenv').config();

const production = process.env.NODE_ENV === 'production';

function get(name, fallback, options = {}) {
  if (process.env[name]) {
    return process.env[name];
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback;
  }
  throw new Error(`Missing env var ${name}`);
}

module.exports = {
  sessionSecret: get('SESSION_SECRET', 'app-insecure-default-session', { requireInProduction: true }),
  db: {
    username: get('DB_USER', 'form-builder'),
    password: get('DB_PASS', 'form-builder'),
    server: get('DB_SERVER', 'localhost'),
    database: get('DB_NAME', 'form-builder'),
    sslEnabled: get('DB_SSL_ENABLED', 'true'),
  },
};
