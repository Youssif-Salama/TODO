import cors from "cors";
import connectDB from "./DbConnection.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import v1Router from "./src/vRouters/v1.router.js";

/**
 * This function is the entry point of the Express.js app.
 * It handles the GET '/' route, sets up CORS, and configures
 * the global error handler. It then calls the connectDB function
 * to connect to the MongoDB database and starts the server.
 *
 * @param {Express.Application} app the Express.js app instance
 */
const Bootstrap = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello");
  });

  // port
  const PORT = process.env.PORT || 5000;

  // cors
  app.use(cors());

  // middlewares
  app.use(cookieParser());
  app.use(passport.initialize());

// routes
app.use("/api/v1",v1Router);

  // global error handler
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  });

  // calling db connection and server
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
};

export default Bootstrap;
