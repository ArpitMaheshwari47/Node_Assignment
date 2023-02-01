const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const { json } = require("express");
const client = redis.createClient()

// .................................. Register User .............................//
const registerUser = async function (req, res) {
  try {
    let body = req.body;
    const user = await userModel.create(body);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: user });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// .................................. Login User .............................//

const loginUser = async function (req, res) {
  try {
    let userName = req.body.userName;
    let password = req.body.password;

    const user = await userModel.findOne({ userName: userName, password: password });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
      },
      "secretKey123"
    );
    res.status(200).send({ status: true, message: "Success", data: token });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
const getUser = async function(req, res) {
    try {
      // Spreading query to pass all the filters in condition
  
      const check = await userModel.find({...req.query });
      if(check.length == 0)   return res.status(404).send({status : false, msg : "No user found"})
    //   redis implementation
      client.setEx("postData",60,JSON.stringify(post))
      return res.status(200).send({ status: true, data: check });
    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
  }

  const redisPost = async function (req,res,next){
        client.get("postdata",(err,redisData)=>{
            if(err){
                throw err
            }
            else if(redisData){
                res.send(JSON.parse(redisData))
            }else{
                next()
            }
        })
  }

const updateUser = async function (req, res) {
    try {
        let userId = req.parmas.userId
        if (userId && !ObjectId.isValid(userId))
        return res
          .status(404)
          .send({ status: false, message: "userId is not valid" });

          let data = req.body

          const {userName,password} = data
          let userDetails = await userModel.findOne({
            _id: userId,
            isDeleted: false,
          });
          if (!userDetails)
            return res
              .status(404)
              .send({ status: false, msg: "user does not exists" });

    //authorization
    let user = await userModel.findById({ _id});
     userId = user._id.toString();

    if (req.headers["userId"] !== userId)
      return res
        .status(403)
        .send({ status: false, msg: "You are not authorized...." });   

        if (userName) userDetails.userName = userName;
        const validName = await userModel.findOne({ userName });
        if (validName)
          return res
            .status(400)
            .send({ status: false, message: "userName is already present" });
        if (password) userDetails.password= password;
        const validPassword = await userModel.findOne({ password });
        if (validPassword)
          return res
            .status(400)
            .send({ status: false, message: "password is already present" });
            userDetails.save();

            return res
              .status(200)
              .send({ status: true, message: "Success", data: userDetails });
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})   
    }
      
  };

module.exports = { registerUser, loginUser ,getUser, redisPost,updateUser };