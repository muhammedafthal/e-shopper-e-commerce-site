
const jwt = require('jsonwebtoken');

function authenticateUser(req, res, next) {
    const token = req.cookies.accessToken 
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        // Verify and decode the JWT
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userAvailable.userId; // Extract userId from JWT payload
        // const decoded
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
}

module.exports = { authenticateUser };





