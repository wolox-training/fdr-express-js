// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const userController = require('./controllers/users');
const userCredentialsMiddleware = require('./middlewares/userCredentials');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [userCredentialsMiddleware.validate], userController.signUp);
};
