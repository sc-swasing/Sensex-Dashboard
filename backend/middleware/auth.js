const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

function authenticateToken(req, res, next) {
    console.log("✅ Middleware executed");


    const authHeader = req.headers["authorization"];
     console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {

        if (err) {
            return res.status(403).json({
                message: "Invalid or Expired Token"
            });
        }

        req.user = user;

        next();
    });

}

module.exports = authenticateToken;