const { mongoose } = require("./db");
mongoose.pluralize(null);

const Schema = mongoose.Schema;
const RegistrationSchema = new Schema(
  {
    rollnumber: { type: String, unique: true },
    username: { type: String, unique: true },
    password1: { type: String, unique: true },
    email: { type: String, unique: true },
    phonenumber: { type: String },
    course: { type: String },
    branch: { type: String },
    batch: { type: String },
    usertype: { type: String },
  },
  { timestamps: true }
);


const UsersSchema = new Schema(
  {
    rollnumber: { type: String, unique: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    phonenumber: { type: String },
    course: { type: String },
    branch: { type: String },
    batch: { type: String },
    usertype: { type: String },
  },
  { timestamps: true }
);


const RegistrationModel = mongoose.model("Registration", RegistrationSchema);
const UsersModel = mongoose.model("Users", UsersSchema);


module.exports = {
  RegistrationModel,UsersModel,
};
