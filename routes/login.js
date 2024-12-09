const express = require('express');
const route = express.Router();
const userModel = require('../models/userModel');
const Category = require('../models/category');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { authenticateToken } = require('../middleware/authenticateToken');

route.get('/', authenticateToken, (req, res) => {
    res.render('login')
})

route.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!(email && password)) {
        res.status(400).json('All Fields Are Mantatory!')
    }
    console.log("Log Password: ", password)

    const userAvailable = await userModel.findOne({ email })
    
    if (userAvailable && (bcrypt.compare(password, userAvailable.password))) {
        const accessToken = jwt.sign({
            userAvailable: {
                userId: userAvailable._id, // Store MongoDB user ID
                username: userAvailable.username, // Store userName from MongoDB
                email: userAvailable.email, // Store userEmail from MongoDB
                role: userAvailable.role // Store userRole From MongoDB
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
        );
        req.session.jwt = accessToken;
        console.log( "This is UserID: ", userAvailable.username)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV || "production",
            sameSite: 'strict',
            expires: new Date(Date.now() +  7 * 24 * 60 * 60 * 1000) // 7 day
        });       
        console.log('Your Token: ', accessToken)
            res.redirect('/start')
    } else {
        res.status(400).json('username or password is not valid')
    }
});

// const authenticateToken = (req, res, next) => {
//     const token = req.cookies.accessToken;
//     if (!token) {
//         // return res.status(400).json('Your token is expired or invalid!');
//         return res.status(200).redirect('/signuser');

//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: "Invalid or expired token! Please log in again." });
//         }
//         req.userAvailable = decoded.userAvailable;
//         next();
//     });
// };

// route.get('/protected', authenticateToken, (req, res) => {
//     res.status(200).json(`Hello, ${req.userAvailable.username}. You have access to this protected route.`);
// });



module.exports = route;