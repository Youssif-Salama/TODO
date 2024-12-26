import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  Title:{type:String,required:true},
  Description:{type:String,required:true},
  isCompleted:{type:Boolean,default:false},
  DueDate:{type:Date,required:true},
  Creator:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel