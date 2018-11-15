const request = require('supertest');
const appSetup = require('./utils/appSetup');
const createRouter = require('../../server/routes/form');
const formConfig = require('../../server/config/section1');

const formService = {
  getFormResponse: jest.fn(),
  update: jest.fn(),
};

const formRoute = createRouter({ formService });

let app;

beforeEach(() => {
  app = appSetup(formRoute);
  formService.getFormResponse.mockResolvedValue({});
});

afterEach(() => {
  formService.getFormResponse.mockReset();
  formService.update.mockReset();
});

describe('GET /section/form', () => {
  test.each`
    path                | expectedContent
    ${'section1/form1'} | ${'Do you want to move to question 2?'}
    ${'section1/form2'} | ${'Would you like to skip question 3?'}
    ${'section1/form3'} | ${'What is your address?'}
    ${'section1/form4'} | ${'Which types of waste do you transport?'}
  `(
  'should render $expectedContent for $path',
  ({ path, expectedContent }) => request(app)
    .get(`/${path}`)
    .expect(200)
    .expect('Content-Type', /html/)
    .expect((res) => {
      expect(res.text).toContain(expectedContent);
    }),
);
});

describe('POST /section/form', () => {
  test.each`
    sectionName   | formName    | userInput                | nextPath
    ${'section1'} | ${'form1'}  | ${{ moveToQ2: 'Yes' }}   | ${'/section1/form2/'}
    ${'section1'} | ${'form2'}  | ${{ skipQ3: 'Yes' }}     | ${'/section1/form4/'}
    ${'section1'} | ${'form2'}  | ${{ skipQ3: 'No' }}      | ${'/section1/form3/'}
    ${'section1'} | ${'form3'}  | ${{ addressLine1: 'a' }} | ${'/section1/form4/'}
    ${'section1'} | ${'form4'}  | ${{ waste: ['a'] }}      | ${'/'}
  `(
  'should render $expectedContent for $sectionName/$formName',
  ({
    sectionName, formName, userInput, nextPath,
  }) => request(app)
    .post(`/${sectionName}/${formName}`)
    .send(userInput)
    .expect(302)
    .expect('Location', nextPath)
    .expect((res) => {
      expect(formService.update).toBeCalledTimes(1);
      expect(formService.update).toBeCalledWith({
        userId: 'user1',
        formId: undefined,
        formObject: {},
        config: formConfig[formName],
        userInput,
        formSection: sectionName,
        formName,
      });
    }),
);
});
