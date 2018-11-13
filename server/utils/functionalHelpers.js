const R = require('ramda');

module.exports = {
  getIn: R.path,
  equals: R.equals,
  isNilOrEmpty,
  allValuesEmpty,
  notAllValuesEmpty,
};

function isNilOrEmpty(item) {
  return R.isEmpty(item) || R.isNil(item);
}

function allValuesEmpty(object) {
  return R.pipe(R.values, R.all(R.isEmpty))(object);
}

function notAllValuesEmpty(object) {
  return !allValuesEmpty(object);
}
