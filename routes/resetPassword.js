const express = require('express');
const route = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

route.get('/', (req, res) => {
    res.render('resetPassword')
})

route.post('/reset', async (req, res) => {
    const { new_password, confirm_password } = req.body
    if (new_password !== confirm_password) {
        return res.status(400).json('password does not match.')
    }

    const email = req.cookies.reset_passwrd_email;
    const hashedPassword = await bcrypt.hash(new_password, 10);
    
    if (!email) {
        res.status(400).json('No email found in cookies!')
    }
    
    const result = await userModel.updateOne({
        email
    },
        {
            password: hashedPassword
        }
    );

    console.log(result);

    if (result.modifiedCount === 0) {
        return res.status(500).json('failed to update password')
    }
    res.status(200).json('password update successfully.')
});
module.exports = route;