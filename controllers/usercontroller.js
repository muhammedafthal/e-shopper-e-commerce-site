// const User = require('../models/User');
const userModel = require('../models/userModel')

exports.getUserProfile = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users) return res.status(404).json({ message: 'User not found' });
    res.render('userManagement', { users });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked; // Toggle blocked status
    await user.save();

    res.redirect('/api/user')
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/api/user');
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
