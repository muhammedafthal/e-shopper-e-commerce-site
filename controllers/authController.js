const User = require('../models/User');

// data = [];
// exports.getRegUser = async (req, res) => {
//   res.render('userManagement', { User });
// };


exports.register = async (req, res) => {
  // Registration logic here
  const { id, username, email, status } = req.body
  const newUser = ({
    id,
    username,
    email,
    status
  })
  const user = await User.create(newUser)
  console.log(user)
  // data.push(user)
  // res.status(200).render('userManagement', { user })
  // res.redirect('/userManagement')
  res.status(200).json('success')
};

exports.login = async (req, res) => {
  // Login logic here
};
