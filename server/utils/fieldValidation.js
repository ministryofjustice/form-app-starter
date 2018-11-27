const joi = require('joi');

const fieldOptions = {
  requiredString: joi.string().required(),
  optionalString: joi.string().allow('').optional(),
  requiredIf: (field, answer, typeRequired = this.requiredString, ifNot = this.optionalString) => joi.when(field, {
    is: answer,
    then: typeRequired,
    otherwise: ifNot,
  }),
};

module.exports = {
  validate: function (value, fieldType) {
    return joi.validate(value, fieldOptions[fieldType], { stripUnknown: true, abortEarly: false });
  },
};
