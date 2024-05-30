const express = require("express");
const { connectdb, mongoose } = require("./db");
const {
  handleUserRegistration,
  handleUserLogin,
  handleUsers,
  fetchUsers,
  handleEditUsers,
  handleDeleteUsers,
  handelFetchOne,
  handleResetPassword,
  handleForgotPassword,
  handleCreateTask,
  handleDeleteTask,
  handleEditTask,
  handlegetTask,
  handlegetTasks,
  handleUpdateSubmitTaskUrl,
  handleUpdateTaskStatus,
  handleUpdateTaskMarks,
  handleUpdateTaskUrl,
  handleUpdateComments,
} = require("./Services");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const LoginShiled = require("./middlewares/LoginShield");
const { verifyToken, isAdmin } = require("./middlewares/AuthShield");

const allowedOrigins = [
  "http://localhost:5173",
  "https://main--gces-app-fe1.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent
};

require("dotenv").config();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyparser.json());

connectdb();

app.get("/", (req, res) => {
  res.send("Server Working");
});

app.get("/connectdb", (req, res) => {
  connectdb(res);
  //res.send("Database Working");
});

app.post("/login", (req, res) => {
  handleUserLogin(req, res);
});

app.post("/registration", (req, res) => {
  handleUserRegistration(req, res);
});

app.post("/create_users", (req, res) => {
  handleUsers(req, res);
});

app.get("/fetchUsers", verifyToken,isAdmin, (req, res) => {
  fetchUsers(req, res);
});

app.put("/editUsers/:id", verifyToken,isAdmin,(req, res) => {
  handleEditUsers(req, res);
});

app.get("/getone/:id", verifyToken, (req, res) => {
  handelFetchOne(req, res);
});

app.delete("/deleteUsers/:id", verifyToken,isAdmin, (req, res) => {
  handleDeleteUsers(req, res);
});

app.post("/forgot-password/", (req, res) => {
  handleForgotPassword(req, res);
});

app.post("/reset-password/:id/:token", (req, res) => {
  handleResetPassword(req, res);
});

app.post("/create-task",verifyToken,isAdmin, (req, res) => {
  handleCreateTask(req, res);
});

app.get("/getTasks",verifyToken,(req, res) => {
  handlegetTasks(req, res);
});

app.get("/getTask",verifyToken,(req, res) => {
  handlegetTask(req, res);
});

app.put("/updateTask/:id",verifyToken,isAdmin,(req, res) => {
  handleEditTask(req, res);
});


app.delete("/deleteTask/:id",verifyToken,isAdmin,(req, res) => {
  handleDeleteTask(req, res);
});


app.put("/updateSubmitTaskUrl/:id",verifyToken,(req, res) => {
  handleUpdateSubmitTaskUrl(req, res);
});

app.put("/updateTaskStatus/:id",verifyToken,isAdmin,(req, res) => {
  handleUpdateTaskStatus(req, res);
});

app.put("/updateTaskMarks/:id",verifyToken,isAdmin,(req, res) => {
  handleUpdateTaskMarks (req, res);
});

app.put("/updateTaskURL/:id",verifyToken,(req, res) => {
  handleUpdateTaskUrl (req, res);
});

app.put("/updatecomments/:id",verifyToken,(req, res) => {
  handleUpdateComments (req, res);
});



app.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log("Server Started at 4001");
});
