const util = require('util');
const logger = require('../logger');
const usersService = require('../services/users');

exports.signUp = (req, res, next) =>
  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`User created: ${req.body.first_name}`);
      return res.status(201).send({ firstName: req.body.first_name });
    })
    .catch(err => {
      logger.info(`User cannot be created: ${util.inspect(err)}`);
      next(err);
    });
