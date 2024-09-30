import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";

import authRoute  from "./routes/auth.routes.js"
import employeeRoute  from "./routes/employee.routes.js"
import attendanceRoute  from "./routes/attendance.routes.js"
import advanceRoute  from "./routes/advance.routes.js"
import locationRoute  from "./routes/location.routes.js"






const app = express();
// Load environment variables
dotenv.config({
  path: "./.env",
});

// Middleware
app.use(express.json()); // For parsing application/json
// Configure CORS
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to the database
connectDatabase();

// Define routes
app.get("/", (req, res) => {
  res.json({
    message: "API is working",
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const apiVersion = "/api/v1";
app.use(`${apiVersion}/auth`, authRoute);
app.use(`${apiVersion}/employee`, employeeRoute);
app.use(`${apiVersion}/attendance`, attendanceRoute);
app.use(`${apiVersion}/advance`, advanceRoute);
app.use(`${apiVersion}/location`, locationRoute);
