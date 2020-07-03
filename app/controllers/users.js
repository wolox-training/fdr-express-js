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

exports.signIn = (req, res, next) =>
  usersService
    .signIn(req.body)
    .then(token => {
      logger.info(`User logged: ${req.body.email}`);
      return res.status(200).send({ token });
    })
    .catch(err => {
      logger.info(`User cannot be logged: ${util.inspect(err)}`);
      next(err);
    });
