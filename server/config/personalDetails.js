module.exports = {
  name: {
    fields: [
      {
        fullName: {
          responseType: 'requiredString',
          validationMessage: 'Please give a full name',
        },
      },
    ],
    validate: true,
    nextPath: {
      path: '/form/personalDetails/dob/',
    },
  },

  dob: {
    fields: [
      { day: {} },
      { month: {} },
      { year: {} },
    ],
    nextPath: {
      path: '/form/personalDetails/address/',
    },
  },

  address: {
    fields: [
      { addressLine1: {} },
      { addressLine2: {} },
      { addressTown: {} },
      { addressCounty: {} },
      { addressPostcode: {} },
    ],
    nextPath: {
      path: '/tasklist',
    },
  },
};
