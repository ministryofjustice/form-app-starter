const {
  equals, isNilOrEmpty, allValuesEmpty, notAllValuesEmpty,
} = require('../utils/functionalHelpers');

module.exports = function createSomeService(formClient) {
  async function getFormResponse(userId) {
    const data = await formClient.getFormDataForUser(userId);

    return data.rows[0] || {};
  }

  async function update({
    userId, formId, formObject, config, userInput, formSection, formName,
  }) {
    const updatedFormObject = getUpdatedFormObject({
      formObject,
      fieldMap: config.fields,
      userInput,
      formSection,
      formName,
    });

    if (equals(formObject, updatedFormObject)) {
      return formObject;
    }

    await formClient.update(formId, updatedFormObject, userId);
    return updatedFormObject;
  }

  function getUpdatedFormObject({
    formObject, fieldMap, userInput, formSection, formName,
  } = {}) {
    const answers = fieldMap.reduce(answersFromMapReducer(userInput), {});

    return {
      ...formObject,
      [formSection]: {
        ...formObject[formSection],
        [formName]: answers,
      },
    };
  }

  function answersFromMapReducer(userInput) {
    return (answersAccumulator, field) => {
      const {
        fieldName,
        answerIsRequired,
        innerFields,
        inputIsList,
        fieldConfig,
      } = getFieldInfo(field, userInput);

      if (!answerIsRequired) {
        return answersAccumulator;
      }

      if (inputIsList) {
        const arrayOfInputs = userInput[fieldName]
          .map(item => getFormResponse(field[fieldName].contains, item))
          .filter(notAllValuesEmpty);

        return { ...answersAccumulator, [fieldName]: arrayOfInputs };
      }

      if (!isNilOrEmpty(innerFields)) {
        const innerFieldMap = field[fieldName].contains;
        const innerAnswers = getFormResponse(innerFieldMap, userInput[fieldName]);

        if (!fieldConfig.saveEmpty && allValuesEmpty(innerAnswers)) {
          return answersAccumulator;
        }

        return { ...answersAccumulator, [fieldName]: innerAnswers };
      }

      return { ...answersAccumulator, [fieldName]: userInput[fieldName] };
    };
  }

  function getFieldInfo(field, userInput) {
    const fieldName = Object.keys(field)[0];
    const fieldConfig = field[fieldName];

    const fieldDependentOn = userInput[fieldConfig.dependentOn];
    const predicateResponse = fieldConfig.predicate;
    const dependentMatchesPredicate =
      fieldConfig.dependentOn && fieldDependentOn === predicateResponse;

    return {
      fieldName,
      answerIsRequired: !fieldDependentOn || dependentMatchesPredicate,
      innerFields: field[fieldName].contains,
      inputIsList: fieldConfig.isList,
      fieldConfig,
    };
  }


  return {
    getFormResponse,
    update,
  };
};
