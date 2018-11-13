module.exports = {
  form1: {
    fields: [
      { moveToQ2: {} },
    ],
    nextPath: {
      path: '/section1/form2/',
    },
  },

  form2: {
    fields: [
      { skipQ3: {} },
      { reason: { dependentOn: 'skipQ3', predicate: 'Yes' } },
    ],
    nextPath: {
      decisions: [
        {
          discriminator: 'skipQ3',
          Yes: '/section1/form4/',
        },
        {
          discriminator: 'skipQ3',
          No: '/section1/form3/',
        },
      ],
    },
  },

  form3: {
    fields: [
      { addressLine1: {} },
      { addressLine2: {} },
      { townOrCity: {} },
      { county: {} },
      { postCode: {} },
    ],
    nextPath: {
      path: '/section1/form4/',
    },
  },

  form4: {
    fields: [
      { waste: {} },
    ],
    nextPath: {
      path: '/',
    },
  },
};
