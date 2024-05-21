const { default: mongoose } = require("mongoose");
const { RegistrationModel,UsersModel } = require("./Schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {ObjectId}=require("mongodb");
const { json } = require("body-parser");
const nodemailer = require('nodemailer'); 



const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const handleUserRegistration = async (req, res) => {
 
  try {
    if (
      !req.body.password1 ||
      !req.body.rollnumber ||
      !req.body.username ||
      !req.body.email ||
      !req.body.phonenumber ||
      !req.body.course ||
      !req.body.branch ||
      !req.body.batch 
    ) {
      return res.status(401).json({
        success: false,
        message: "Bad Credentials",
      });
    } else {
      const hash = bcrypt.hashSync(req.body.password1, salt);
      req.body.password1 = hash;
      const NEW_USER = new RegistrationModel(req.body);
      if (NEW_USER) {
        const response = await NEW_USER.save();
      
        if (response) {

        
          const JWT_TOKEN = jwt.sign(
            { rollnumber: NEW_USER.rollnumber },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: '1d',
              issuer: "APP_SERVER",
              subject: "Token for session",
            }
          );
          const options = {
            maxAge:"1d", // ------ in milliseconds
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
          };
          
          res.cookie("loginShield", JWT_TOKEN, options);
          return res.status(201).json({
            success: true,
            message: "Account Registration Successful.",
            users: response,
          });
        } 
        else {
          throw new Error("Account Registration Failed.");
        }
      }
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `${getDuplicateElementKey(error.keyPattern)} already taken.`,
      });
    }
    return res.status(500).json({
      success: false,
      error: error,
      message: "Internal Server Error.",
    });
  }

  function getDuplicateElementKey(data = {}) {
    let keys = [];
    if (data) {
      keys = Object.keys(data);
    }
    return keys[0];
  }
};

const handleUserLogin = async (req, res) => {
  try {
    if (!req.body.password1 || !req.body.rollnumber || !req.body.email) {
      return res.status(401).json({
        success: false,
        message: "Bad Credentials",
      }); 
    } else {
      const saved_user = await RegistrationModel.findOne({
        rollnumber: req.body.rollnumber,
      });
      if (saved_user && saved_user._id) {
        if (bcrypt.compareSync(req.body.password1, saved_user.password1)) {
          const JWT_TOKEN = jwt.sign(
            { rollnumber: saved_user.rollnumber },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: '1d',
              issuer: "APP_SERVER",
              subject: "Token for session",
            }
          );
          const options = {
            maxAge:"1d", // ------ in milliseconds
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
          };
          res.cookie("loginShield", JWT_TOKEN, options);
          return res.status(200).json({
            success: true,
            message: "Login Successful.",
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Bad Credentials",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Account does not exists.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
      message: "Internal Server Error.",
    });
  }
};  



const handleUsers = async (req, res) => {
  try {
    if (
      !req.body.rollnumber ||
      !req.body.username ||
      !req.body.email ||
      !req.body.phonenumber ||
      !req.body.course ||
      !req.body.branch ||
      !req.body.batch ||
      !req.body.usertype
    ) {
      return res.status(401).json({
        success: false,
        message: "Bad Credentials",
      });
    } else {
      const NEW_USER = new UsersModel(req.body);
      if (NEW_USER) {
        const response = await NEW_USER.save();
        if (response) {
          return res.status(201).json({
            success: true,
            message: "User Creation Successful.",
            user: response,
          });
        } else {
          throw new Error("User Creation Failed.");
        }
      }
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `${getDuplicateElementKey(error.keyPattern)} already taken.`,
      });
    }
    return res.status(500).json({
      success: false,
      error: error,
      message: "Internal Server Error.",
    });
  }

  function getDuplicateElementKey(data = {}) {
    let keys = [];
    if (data) {
      keys = Object.keys(data);
    }
    return keys[0];
  }
};


const fetchUsers=async (req,res)=>{  
  try {
    const response =await  UsersModel.find();
    if(response){
      return res.status(201).json({
        success: true,
        message: "Data Fetching Successful.",
        user: response,
      });
    }else{
      throw new Error("Data Fetching Failed.");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
      message: "Internal Server Error.",
    });
  }
  
  }

  const handelFetchOne=async (req,res)=>{  
    try {
    const id=req.params.id
      const response =await  UsersModel.findById(id);
      if(response){
        return res.status(201).json({
          success: true,
          message: "Data Fetching Successful.",
          user: response,
        });
      }else{
        throw new Error("Data Fetching Failed.");
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "Internal Server Error.",
      });
    }
    
    }

  const handleEditUsers=async (req,res)=>{  
      
    try {
      const id=req.params.id
      const userExist= await UsersModel.findById(id)
      if(!userExist){
        return res.status(404).json({
          message:"User Not Found...",
        })
      }
      else{
        const filter=id;
       const  update=req.body;
       const response =await UsersModel.findByIdAndUpdate(filter,update,{new:true});
        if(response){
       return res.status(200).json({
        success: true,
        message: "Data Updated Successful.",
        user: response,
       });
      }else{
         throw new Error("Data Updated Failed.");
        }
      }
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "Internal Server Error.",
      });
    }
    
    }

    const handleDeleteUsers=async (req,res)=>{  
      
      try {
        const id=req.params.id
        const userExist= await UsersModel.findById(id)
        if(!userExist){
          return res.status(404).json({
            message:"User Not Found...",
          })
        }
        else{
        
         const response =await UsersModel.findByIdAndDelete(id);
          if(response){
         return res.status(200).json({
          success: true,
          message: "Data Deleted  Successful.",
          user: response,
         });
        }else{
           throw new Error("Data Deleted Failed.");
          }
        }
        
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error,
          message: "Internal Server Error.",
        });
      }
      
      }

      const handleForgotPassword= async(req, res)=>{
        try {
          const email= req.body.email;
          const userExist= await RegistrationModel.findOne({email:email})
        
      if(!userExist){ 
        return res.status(404).json({
          message:"User Not Found...",
        })
      }
      else{
        const token = jwt.sign({id: userExist._id}, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.ME,
            pass:process.env.PASSWORD,
          }
        });
        var mailOptions = {
          from: process.env.ME,
          to:email,
          subject: 'Reset Password Link',
          text: `Please click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${userExist._id}/${token}`,
         
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            return res.send({Status: "Reset Password Link send Success"})
          }
        });
      }
        } catch (error) {
          return res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error....",
          });
        }

      }

      const handleResetPassword=async(req,res)=>{
        try {
          const id = req.params.id
          const token=req.params.token
          const isTokenValid = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            complete: true,
          });
          if (isTokenValid) {
            const filter={_id:id};
       const  password=req.body.password;
       const hash = bcrypt.hashSync(password, salt);
       req.body.password = hash;
       const update={password1:hash}
       const response =await RegistrationModel.findByIdAndUpdate(filter,update,{new:true});
        if(response){
       return res.status(200).json({
        success: true,
        message: "Password Reset Successful.",
        user: response,
       });
      }else{
         throw new Error("Password Reset Failed.");
        }
          }else{
            return res.status(401).json({message: "Token expired or invalid"})
          }
        } catch (error) {
          return res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error.",
          });
        }
      }


module.exports = {handleUserRegistration, handleUserLogin,handleUsers,fetchUsers,handleEditUsers,handleDeleteUsers,handelFetchOne,handleResetPassword,handleForgotPassword};
