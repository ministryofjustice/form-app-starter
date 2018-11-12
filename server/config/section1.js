module.exports = {
  form1: {
    fields: [
      { question1: {} },
      { question2: {} },
    ],
    nextPath: {
      path: '/section1/form2/',
    },
  },

  form2: {
    fields: [
      { question1: {} },
      { question1Details: { dependentOn: 'question1', predicate: 'Yes' } },
    ],
    nextPath: {
      decision: [
        {
          discriminator: 'question1',
          No: '/section1/form4/',
        },
      ],
      path: '/section1/form2/',
    },
  },
};
