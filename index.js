import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Bootstrap from './bootstrap.js';


// intialize the express app
const app=express();
app.use(express.json());

// import the bootstrap function
Bootstrap(app);