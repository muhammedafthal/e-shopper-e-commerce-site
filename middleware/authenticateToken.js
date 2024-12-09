
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken; // Access the token from cookies
    if (!token) {
        return res.status(200).render('login');
    }


    // try {
    //     // Verify and decode the JWT
    //     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //     req.userId = decoded.userAvailable.userId; // Extract userId from JWT payload
    //     // const decoded
    //     next(); // Proceed to the next middleware or route handler
    // } catch (err) {
    //     return res.status(400).json({ error: 'Invalid token.' });
    // }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token! Please log in again." });
        }
        req.userAvailable = decoded.userAvailable;
        req.userId = decoded.userAvailable.userId; // Attach decoded data to the request
        req.userEmail = decoded.userAvailable.email; 
        next();
    });
};

module.exports = { authenticateToken };
