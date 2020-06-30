const models = require('../models/index');
const logger = require('../logger');
const passwordHelper = require('../helpers/passwords');
const errors = require('../errors');

exports.signUp = ({ email, password, first_name, last_name }) =>
  models.user
    .findOne({ where: { email } })
    .then(user => {
      if (user) {
        throw errors.emailExistsError();
      } else {
        return models.user
          .create({
            firstName: first_name,
            lastName: last_name,
            email,
            password: passwordHelper.hashPassword(password)
          })
          .catch(err => {
            logger.info(`Database Create Error: ${JSON.stringify(err)}`);
            throw errors.databaseError(JSON.stringify(err));
          });
      }
    })
    .catch(err => {
      logger.info(`Database Find Error: ${JSON.stringify(err)}`);
      throw errors.databaseError(JSON.stringify(err));
    });
