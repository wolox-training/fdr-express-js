const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.EMAIL_ERROR = 'invalid_email';
exports.emailError = message => internalError(message, exports.EMAIL_ERROR);

exports.PASSWORD_ERROR = 'invalid_password';
exports.passwordError = message => internalError(message, exports.PASSWORD_ERROR);

exports.EMAIL_EXISTS_ERROR = 'email_exists';
exports.emailExistsError = message => internalError(message, exports.EMAIL_EXISTS_ERROR);

exports.INVALID_CREDENTIALS = 'invalid_credentials';
exports.invalidCredentials = message => internalError(message, exports.INVALID_CREDENTIALS);

exports.TOKEN_ERROR = 'token_error';
exports.invalidToken = message => internalError(message, exports.TOKEN_ERROR);
