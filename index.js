import express from 'express';
import dotenv from 'dotenv';
import Bootstrap from './bootstrap.js';

// Load the environment variables based on the NODE_ENV
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

// intialize the express app
const app=express();
app.use(express.json());

// import the bootstrap function
Bootstrap(app);