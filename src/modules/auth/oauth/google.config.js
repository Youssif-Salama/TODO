import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from 'dotenv';

// Load the environment variables based on the NODE_ENV
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}


// start passport integration and google oauth
 const passportIntegrationWithGoogle=passport.use(
  new GoogleStrategy(
    {
    clientID:process.env.Google_Id,
    clientSecret:process.env.Google_Secret,
    callbackURL:process.env.Google_callbackUrl
  },
  (accessToken,refreshToken,profile,done)=>{
    return done(null,{profile,accessToken,refreshToken})
  }
)
)


export default passportIntegrationWithGoogle