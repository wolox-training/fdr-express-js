const models = require('../models/index');
const logger = require('../logger');
const passwordHelper = require('../helpers/passwords');
const errors = require('../errors');

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
          password: passwordHelper.hashPassword(password)
        })
        .catch(err => {
          logger.info(`Database Create Error: ${JSON.stringify(err)}`);
          throw errors.databaseError();
        });
    });
