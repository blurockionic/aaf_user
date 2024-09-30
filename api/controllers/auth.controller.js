import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";
import { sendCookie } from "../utils/cookie.js";
import Employee from "../models/employee.model.js";

export const registration = async (req, res) => {
  const { email, password, fullName, role, clerk_id } = req.body;

  try {
    // Validation
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Please enter full name",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter email",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter a password",
      });
    }

    // Check if email already exists
    const isEmailExist = await Auth.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Encrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await Auth.create({
      fullName,
      email,
      password: hashPassword,
      role: role,
      clerk_id: clerk_id,
    });

    // Send cookie and response
    sendCookie(user, res, "Account created successfully.", 201);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//login
export const login = async (req, res) => {
  // Fetch all the data from request body
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password!",
      });
    }

    // Check if email exists
    const user = await Auth.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist! Please register!",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Please enter the correct password!",
      });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      {
        expiresIn: "3d",
      }
    );

    // Set cookie for token and return success response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "Login successful!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during login",
    });
  }
};

//verify owner
export const verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Employee.findOne({ email: email });

    if (user) {
      // Mark the user as verified and clear the verification token
      res.json({ message: "Email verified successfully!" });
    } else {
      res.status(404).json({ message: "Email not verified!." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update the  profile iamge
export const updateDetails = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    const updateUser = await AuthUser.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          profilePicture: req.body.profilePicture,
        },
      },
      {
        new: true,
        runValidators: true, // Ensures validation is run
      }
    ).lean(); // Converts mongoose document to plain JavaScript object

    // Separate the password
    const { password, ...rest } = updateUser;

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

// logout the user
export const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logout successful!",
  });
};

export const getProfile = async (req, res) => {
  try {
    const user = await Auth.find({ clerk_id: req.params.id }).select(
      "-password"
    );
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
