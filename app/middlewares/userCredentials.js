const errors = require('../errors');

const PASSWORD_MIN_LENGTH = 8;

const validateEmail = email => {
  const regex = /@wolox\.(com|com\.cl|co|com\.mx|com\.ar)$/;
  return regex.test(email);
};

const validatePassword = password => {
  const regex = /^\w+$/;
  return password && regex.test(password) && password.length >= PASSWORD_MIN_LENGTH;
};

exports.validate = (req, _, next) => {
  if (!validateEmail(req.body.email)) {
    return next(errors.emailError());
  }

  if (!validatePassword(req.body.password)) {
    return next(errors.passwordError());
  }

  return next();
};
