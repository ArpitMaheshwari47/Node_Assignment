const jwt = require("jsonwebtoken");

const Authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["x-Api-key"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "Token must be present" });

    jwt.verify(token, "secretKey123", (error, response) => {
      if (error) {
        const msg =
          error.message === "jwt expired"
            ? "Token is expired"
            : "Token is invalid";
        return res.status(401).send({ status: false, msg });
      }
      req.headers["userId"] = response.userId;
      next();
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { Authentication };
