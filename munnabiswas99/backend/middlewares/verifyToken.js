const admin = require("../firebaseAdmin");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        message: "Unauthorized Access",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.decoded = decoded;

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Invalid Token",
    });
  }
};

module.exports = verifyToken;