const supertest = require('supertest');
const app = require('../../app');
const models = require('../../app/models/index');

const request = supertest(app);

const bodyUser = (firstName, lastName, email, password) => ({
  first_name: firstName,
  last_name: lastName,
  email,
  password
});

describe('user controller', () => {
  describe('POST /users', () => {
    it('Should create a user without errors', () =>
      request
        .post('/users')
        .send(bodyUser('Test', 'Testing', 'test@wolox.com.ar', 'A12345678'))
        .then(response => {
          expect(response.statusCode).toEqual(201);
          expect(response.body.firstName).toBe('Test');
        })
        .then(() =>
          models.user
            .findAll({
              where: {
                email: 'test@wolox.com.ar'
              }
            })
            .then(user => {
              expect(user.length).toEqual(1);
              expect(user[0].firstName).toBe('Test');
              expect(user[0].lastName).toBe('Testing');
              expect(user[0].email).toBe('test@wolox.com.ar');
            })
        ));

    it('Should not create a user with a existing email', () => {
      models.user
        .create({
          firstName: 'John',
          lastName: 'Testing',
          email: 'test@wolox.com.ar',
          password: '12345678'
        })
        .then(() =>
          request
            .post('/users')
            .send(bodyUser('Test', 'Testing', 'test@wolox.com.ar', 'A12345678'))
            .then(response => {
              expect(response.statusCode).toEqual(500);
              expect(response.body).toHaveProperty('internal_code', 'database_error');
            })
        );
    });

    it('Should not create a user with a non wolox domain email', () =>
      request
        .post('/users')
        .send(bodyUser('Test', 'Testing', 'test@test.com.ar', 'A12345678'))
        .then(response => {
          expect(response.body.internal_code).toBe('invalid_email');
        }));

    it('Should not create a user with invalid password', () =>
      request
        .post('/users')
        .send(bodyUser('Test', 'Testing', 'test@wolox.com.ar', 'A12'))
        .then(response => {
          expect(response.statusCode).toEqual(500);
          expect(response.body).toHaveProperty('internal_code', 'invalid_password');
        }));

    it('Should not create a user with empty required params', () => {
      request
        .post('/users')
        .send(bodyUser('Test', null, null, '12345678'))
        .then(response => {
          expect(response.statusCode).toEqual(500);
          expect(response.body).toHaveProperty('internal_code', 'invalid_email');
        });
    });
  });
});
