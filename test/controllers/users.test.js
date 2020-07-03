const supertest = require('supertest');
const app = require('../../app');
const models = require('../../app/models/index');

const request = supertest(app);

describe('user controller', () => {
  describe('POST /users', () => {
    it('Should create a user without errors', () =>
      request
        .post('/users')
        .send({
          first_name: 'Test',
          last_name: 'Testing',
          email: 'test@wolox.com.ar',
          password: 'A12345678'
        })
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
            .send({
              first_name: 'Test',
              last_name: 'Testing',
              email: 'test@wolox.com.ar',
              password: 'A12345678'
            })
            .then(response => {
              expect(response.statusCode).toEqual(500);
              expect(response.body).toHaveProperty('internal_code', 'database_error');
            })
        );
    });

    it('Should not create a user with a non wolox domain email', () =>
      request
        .post('/users')
        .send({
          first_name: 'Test',
          last_name: 'Testing',
          email: 'test@test.com.ar',
          password: 'A12345678'
        })
        .then(response => {
          expect(response.body.internal_code).toBe('invalid_email');
        }));

    it('Should not create a user with invalid password', () =>
      request
        .post('/users')
        .send({
          first_name: 'Test',
          last_name: 'Testing',
          email: 'test@wolox.com.ar',
          password: 'A12'
        })
        .then(response => {
          expect(response.statusCode).toEqual(500);
          expect(response.body).toHaveProperty('internal_code', 'invalid_password');
        }));

    it('Should not create a user with empty required params', () => {
      request
        .post('/users')
        .send({
          first_name: 'Test',
          last_name: null,
          email: null,
          password: '12345678'
        })
        .then(response => {
          expect(response.statusCode).toEqual(500);
          expect(response.body).toHaveProperty('internal_code', 'invalid_email');
        });
    });
  });

  describe('POST /users/sessions', () => {
    beforeEach(() =>
      request.post('/users').send({
        first_name: 'Test',
        last_name: 'Testing',
        email: 'test@wolox.com.ar',
        password: 'A12345678'
      })
    );

    it('Should sign in a user without errors', () =>
      request
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar',
          password: 'A12345678'
        })
        .then(response => {
          expect(response.statusCode).toEqual(200);
          expect(response.body).toHaveProperty('token');
        }));

    it('Should not sign when is not a wolox domain email', () =>
      request
        .post('/users/sessions')
        .send({
          email: 'test@test.com.ar',
          password: 'A12345678'
        })
        .then(response => {
          expect(response.statusCode).toEqual(500);
          expect(response.body).toHaveProperty('internal_code', 'invalid_email');
        }));

    it('Should not sign when is the password is wrong', () =>
      request
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar',
          password: 'incorrect12'
        })
        .then(response => {
          expect(response.statusCode).toEqual(500);
          expect(response.body).toHaveProperty('internal_code', 'invalid_credentials');
        }));
  });
});
