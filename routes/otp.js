const express = require('express');
const route = express.Router();

// otp = null
route.get('/', (req, res) => {
    res.render('otp')
})
route.post('/otp', (req, res) => {
    const { otp } = req.body
    const otp_cookies = req.cookies.otp_no
    if( otp === otp_cookies) {
        res.render('resetPassword')
    }
    res.status(400).json("Invalid otp number")
})

module.exports = route;