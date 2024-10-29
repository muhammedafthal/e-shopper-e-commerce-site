const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  const result = await User.create({
    name,
    email,
    password
  })
  res.status(200).json('registered succefully.')
  // Registration logic here
};

exports.login = async (req, res) => {
  // Login logic here
};
