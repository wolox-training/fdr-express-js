const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.hashPassword = myPlaintextPassword => bcrypt.hashSync(myPlaintextPassword, saltRounds);

exports.isEqualPasswords = (myPlaintextPassword, hashPassword) =>
  bcrypt.compareSync(myPlaintextPassword, hashPassword);
