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

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersModel', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersModel', required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  marks: {type: Number, default: 0  },
  adminComments: { type: String },
  studentComments: { type: String },
  taskUrl: { type: String },
  submissionUrl: { type: String ,default: null},
},{timestamps:true});


const RegistrationModel = mongoose.model("Registration", RegistrationSchema);
const UsersModel = mongoose.model("Users", UsersSchema);
const TaskModel = mongoose.model("Tasks", TaskSchema);


module.exports = {
  RegistrationModel,UsersModel,TaskModel,
};
