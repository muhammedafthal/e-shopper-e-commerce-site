const express = require('express');
const route = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const nodemailer = require('nodemailer');

route.get('/', (req, res) => {
    res.render('forget')
})

route.post('/sent-otp', async(req, res) => {
    const { email } = req.body
    const userAvailable = await userModel.findOne({ email })
    if(!userAvailable) {
        res.status(404).json('user not found')
    } else {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'afthal50@gmail.com',
                pass: 'tszs lizy yigu wssp'
            }
        })

        transport.sendMail({
            from: 'afthal50@gmail.com',
            to: 'afthal50@gmail.com',
            subject: 'OTP verification',
            text: `Your OTP Code is ${otp}`
        }, (error, info) => {
            if (error) {
                console.log('Error occured: ', error);
            } else {
                console.log("Email has been sent to: ", email, info.response);
            }
        });

        res.cookie('reset_passwrd_email', email, {
            // maxAge: 3600000,
            httpOnly: true,
            expires: new Date(Date.now() + 1 * 60 * 1000)
        });

        res.cookie('otp_no', otp, {
            // maxAge: 3600000,
            httpOnly: true,
            expires: new Date(Date.now() + 1 * 60 * 1000)
        });

        res.render('otp')
    }
    
})


module.exports = route;