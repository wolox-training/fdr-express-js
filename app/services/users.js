const jwt = require('jsonwebtoken');
const models = require('../models/index');
const logger = require('../logger');
const { hashPassword, isEqualPasswords } = require('../helpers/passwords');
const errors = require('../errors');
const config = require('../../config');

exports.signUp = ({ email, password, first_name, last_name }) =>
  models.user
    .findOne({ where: { email } })
    .catch(err => {
      logger.info(`Database Find Error: ${JSON.stringify(err)}`);
      throw errors.databaseError();
    })
    .then(user => {
      if (user) {
        throw errors.emailExistsError();
      }
      return models.user
        .create({
          firstName: first_name,
          lastName: last_name,
          email,
          password: hashPassword(password)
        })
        .catch(err => {
          logger.info(`Database Create Error: ${JSON.stringify(err)}`);
          throw errors.databaseError();
        });
    });

exports.signIn = ({ email, password }) =>
  models.user
    .findOne({ where: { email } })
    .catch(err => {
      logger.info(`Database Find Error: ${JSON.stringify(err)}`);
      throw errors.databaseError();
    })
    .then(user => {
      if (!user || !isEqualPasswords(password, user.password)) {
        throw errors.invalidCredentials();
      }
      const tokenArray = { email: user.email };
      const token = jwt.sign(tokenArray, config.common.session.secret, { expiresIn: '1800s' });
      if (token) return token;
      throw errors.invalidToken('Cannot generate a token');
    });
