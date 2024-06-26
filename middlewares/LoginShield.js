const jwt = require("jsonwebtoken");

function LoginShield(req, res,next) {

  try {
    
    if (req.cookies.loginShield || req.cookies) {
      const token = req.cookies.loginShield;
      const isTokenValid = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        complete: true,
      });
      if (isTokenValid) {
        req.user = isTokenValid;
        next();
      }
    } else {
      return res.status(401).json({ message: "Access Denied" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token.",
    });
  }
}

module.exports = LoginShield;
