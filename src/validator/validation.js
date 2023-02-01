

// Validataion for empty request body
const isValidObject = function (value) {
  if (Object.keys(value).length === 0) return false;
  else return true;
};

// Validation for Strings/ Empty strings
const hasEmptyString = function (value) {
  if (typeof value !== "string") return false;
  else if (value.trim().length == 0) return false;
  else return true;
};

// Validation for Strings contain numbers
const stringContainNumber = function (value) {
  if (!/^[ a-z ]+$/i.test(value)) return false;
  else return true;
};

// Validation for User
const validationForUser = async function (req, res, next) {
  try {
    let data = req.body;
    let { userName, password } = data;
  

    if (!isValidObject(data))
      return res
        .status(400)
        .send({ status: false, message: "Missing Parameters" });

   

    if (!userName)
      return res
        .status(400)
        .send({ status: false, message: "userName is required" });
    else if (!hasEmptyString(userName) || !stringContainNumber(userName))
      return res
        .status(400)
        .send({ status: false, message: "userName is in wrong format" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    else if (!hasEmptyString(password))
      return res
        .status(400)
        .send({ status: false, message: "Password is in wrong format" });
    else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/.test(
        password
      )
    )
      return res.status(400).send({
        status: false,
        message:
          "Password length should be in between 8 and 15 and must contain one special charcter , one alphabet and one number",
      });
      } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
  next();
};

const validationForLogin = async function (req, res, next) {
  try {
    let userName = req.body.userName;
    let password = req.body.password;
    if (!userName) {
      return res
        .status(400)
        .send({ status: false, message: "userName is required" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
  next();
};

module.exports = {
    validationForUser,
    validationForLogin,

}
