const jwt = require("jsonwebtoken");
const { UsersModel } = require("../Schema");

const  verifyToken =(req, res,next)=> {
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

const isAdmin = async (req, res, next) => {
  const filter={rollnumber:req.user.payload.rollnumber}
    const user = await UsersModel.findOne(filter);
    if (user && user.usertype === 'Admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access Denied' });
    }
  };


module.exports = { verifyToken, isAdmin };
