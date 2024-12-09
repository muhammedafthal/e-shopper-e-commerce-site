
const express = require('express');
const route = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');

route.get('/', (req, res) => {
    res.render('signup', { err: "" });
});

route.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all fields are filled
    if (!(username && email && password)) {
        return res.render('signup', { err: 'All fields are required.' });
    }

    console.log("Reg Password: ", password)

    // Validate password strength using validator library
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return res.render('signup', { err: 'yrfhvhfv' });
    }

    // Check if the email is already taken
    const userAvailable = await userModel.findOne({ email });
    if (userAvailable) {
        return res.render('signup', { err: 'User already exists!' });
    }

    // try {
        // Hash the password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        const newUser =  await userModel({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // Redirect to login page on successful registration
        return res.status(201).redirect('/loginuser');
    // } catch (error) {
        // console.error("Error creating user:", error);
        // res.status(500).render('signup', { err: 'Something went wrong!' });
    // }
});

module.exports = route;
