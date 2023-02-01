const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const mongoose = require("mongoose");
const userController = require("./controllers/userController");
const middlewares = require("./middleware/auth");
const validation = require("./validator/validation");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

// storage engine 

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    }
})

router.post("/upload", upload.single('profile'), (req, res) => {

    res.json({
        success: 1,
        profile_url: `http://localhost:3000/profile/${req.file.filename}`
    })
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);


router.post("/register",validation.validationForUser, userController.registerUser)
router.post("/login",validation.validationForLogin, userController.loginUser)
router.get("/users", userController.redisPost,userController.getUser)
router.put("/users",middlewares.Authentication,userController.updateUser)



mongoose
  .connect(
    "mongodb+srv://Ankita220296:Ankita704696@cluster0.d9vvv.mongodb.net/group12Database?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));


app.listen(3000, function () {
  console.log("Express app running on port" + 3000);
});