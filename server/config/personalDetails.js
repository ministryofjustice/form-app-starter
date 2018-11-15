module.exports = {
  name: {
    fields: [
      { fullName: {} },
    ],
    nextPath: {
      path: '/form/personalDetails/age/',
    },
  },

  age: {
    fields: [
      { dobDay: {} },
      { dobMonth: {} },
      { dobYear: {} },
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
