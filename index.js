const express=require("express");
const{connectdb,mongoose}=require("./db");
const {handleUserRegistration,handleUserLogin,handleUsers,fetchUsers,handleEditUsers,handleDeleteUsers,handelFetchOne,handleResetPassword,handleForgotPassword}=require("./Services")
const app=express();
const bodyparser=require("body-parser");
const cors=require("cors");
const cookieParser = require('cookie-parser');
const LoginShiled = require("./middlewares/LoginShield");



require('dotenv').config()
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173',"https://main--gces-app-fe1.netlify.app/"] ,// Your frontend URL
  credentials: true,
}));
app.use(bodyparser.json( ));

connectdb();

app.get("/",(req,res)=>{
  res.send("Server Working");
})

app.get("/connectdb",(req,res)=>{
  connectdb(res);
  //res.send("Database Working");
})

app.post("/login",(req,res)=>{
    handleUserLogin(req,res);
    })

    
    app.post("/registration",(req,res)=>{
        handleUserRegistration(req,res);
        })


        app.post("/create_users",(req,res)=>{
          handleUsers(req,res);
          })


          app.get("/fetchUsers",LoginShiled,(req,res)=>{
            fetchUsers(req,res);
            })

            
          app.put("/editUsers/:id",LoginShiled,(req,res)=>{
            handleEditUsers(req,res);
            })

            app.get("/getone/:id",LoginShiled,(req,res)=>{
              handelFetchOne(req,res)
            })
      

            app.delete("/deleteUsers/:id",LoginShiled,(req,res)=>{
              handleDeleteUsers(req,res);
              })

              app.post('/forgot-password/', (req, res) =>{
                handleForgotPassword(req,res);
              })

              app.post('/reset-password/:id/:token', (req, res) =>{
                handleResetPassword(req,res);
              })

              
app.listen(process.env.PORT,process.env.HOSTNAME,()=>{
    console.log("Server Started at 4001")
})