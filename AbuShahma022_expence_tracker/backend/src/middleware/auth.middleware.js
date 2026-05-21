import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

  try {

    // Get Token From Cookie
    const token = req.cookies.token;

    
    // Check Token Exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }


    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Attach User Info
    req.user = decoded;


    next();

  } catch (error) {

    next(error);

  }

};

export default authMiddleware;