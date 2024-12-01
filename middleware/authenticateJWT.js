const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    // Extract token from headers
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token received:", token); // Debugging: Check if token is received

    if (!token) {
        // Allow public access if no token is provided
        req.user = null; // No user information in the request
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log("Decoded token:", decoded); // Debugging: Check decoded token
        req.user = decoded; // Attach decoded data to the request
        next(); // Proceed to the next middleware or route
    } catch (error) {
        console.log("Token verification failed:", error); // Debugging: Log error
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authenticateJWT;

