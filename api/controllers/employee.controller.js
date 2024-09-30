import jwt from "jsonwebtoken";
import Employee from "../models/employee.model.js";
import bcrypt from "bcrypt";
import Auth from "../models/auth.model.js";

export const newEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
      email,
      password,
    } = req.body;

    //create a new Employee
    const newEmployee = new Employee({
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
      email,
      password,
    });

    //crete credentials
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //check email exists or not
    // const isEmailExist = await Auth.findOne({ email:email });
    // if (isEmailExist) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Email already exists",
    //   });
    // }
    // console.log("working")

    // //create credentials
    // const newCredentials = new Auth({
    //   fullName: employeeName,
    //   email,
    //   password: hashPassword,
    // });

    // // Create the user
    // const user = await users.createUser({
    //   emailAddress: [email],
    //   password: password,
    // });

    // // Set the user's role in public metadata
    // await users.updateUser(user.id, {
    //   publicMetadata: { role: "employee" },
    // });

    //save credentials
    // await newCredentials.save();

    await newEmployee.save();

    // Send cookie and response
    // console.log(`User created with role: ${role}`);

    res
      .status(201)
      .json({ message: "Employee saved successfully ", employee: newEmployee });

    // sendCookie(user, res, "Employee saved successfully.", 201);
  } catch (error) {
    console.log("Error creating employee", error);
    res.status(500).json({ message: "Failed to add an employee" });
  }
};

//endpoint to fetch all the employee
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the employees" });
  }
};

//get employee by id
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the employee" });
  }
};
export const getEmployeeByEmail = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the employee" });
  }
};

//get employee by id
export const getEmployeeByClerkId = async (req, res) => {
  try {
    const employee = await Employee.find({ clerk_id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the employee" });
  }
};
