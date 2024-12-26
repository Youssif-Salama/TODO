import mongoose from "mongoose";
import { hashPassword } from "../../utils/bcrypt/bcrypt.utils.js";
import dotenv from 'dotenv';

// Load the environment variables based on the NODE_ENV
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const userSchema = new mongoose.Schema({
  UserName:{
    type:String
  },
  Email:{
    type:String,
    match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    required:true,
    unique:true
  },
  Password:{
    type:String,
    match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, 'Password must be at least 8 characters long and contain at least one letter and one number'],
    required:true
  },
  googleId:{
    type:String
  },
  Verified:{
    type:Boolean,
    default:false
  }
},{timestamps:true});

userSchema.pre(/create|save|insert/i, function (next) {
  const splitedEmail = this.Email.split('@');
  this.UserName = splitedEmail[0];
  const hashedPassword = hashPassword(this.Password, +process.env.SALT_ROUNDS)
  this.Password = hashedPassword;
  next();
});

userSchema.pre(/update/i, function (next) {
  const password = this._update.Password;
  if (password) {
    const hashedPassword = hashPassword(password, +process.env.SALT_ROUNDS)
    this._update.Password = hashedPassword;
  }
  next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;