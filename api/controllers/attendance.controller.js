import moment from "moment";
import Attendance from "../models/attendance.model.js";

//endpoint mark attendance
export const markAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      date,
      status,
      advanceOrLoan,
      extraBonus,
    } = req.body;

    const existingAttendance = await Attendance.findOne({ employeeId, date });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      res.status(200).json(existingAttendance);
    } else {
      const newAttendance = new Attendance({
        employeeId,
        employeeName,
        date,
        status,
        advanceOrLoan,
        extraBonus,
      });

      await newAttendance.save();

      res.status(200).json(newAttendance);
    }
  } catch (error) {
    res.status(500).json({ message: "Error submitting attendance" });
  }
};

//endpoint to fetch all the attendance
export const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    // Find attendance records for the specified date
    const attendanceData = await Attendance.find({ date: date });

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance data" });
  }
};

//attendance report of all employees
export const getAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    console.log("Query parameters:", month, year);

    // Aggregate attendance data for all employees and date range
    const report = await Attendance.aggregate([
      {
        $addFields: {
          parsedDate: {
            $convert: {
              input: "$date",
              to: "date",
              onError: null, // In case of conversion failure, use null
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $ne: ["$parsedDate", null] }, // Exclude documents where parsing failed
              { $eq: [{ $month: "$parsedDate" }, parseInt(month)] },
              { $eq: [{ $year: "$parsedDate" }, parseInt(year)] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          present: {
            $sum: {
              $cond: { if: { $eq: ["$status", "present"] }, then: 1, else: 0 },
            },
          },
          absent: {
            $sum: {
              $cond: { if: { $eq: ["$status", "absent"] }, then: 1, else: 0 },
            },
          },
          halfday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "halfday"] }, then: 1, else: 0 },
            },
          },
          holiday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "holiday"] }, then: 1, else: 0 },
            },
          },
        },
      },
      {
        $lookup: {
          from: "employees", // Name of the employee collection
          localField: "_id",
          foreignField: "employeeId",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails", // Unwind the employeeDetails array
      },
      {
        $project: {
          _id: 1,
          present: 1,
          absent: 1,
          halfday: 1,
          name: "$employeeDetails.employeeName",
          designation: "$employeeDetails.designation",
          salary: "$employeeDetails.salary",
          employeeId: "$employeeDetails.employeeId",
        },
      },
    ]);

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ message: "Error generating the report" });
  }
};

export const getAttendanceReportById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const { month, year } = req.query;

    console.log("Query parameters:", month, year);

    // Aggregate attendance data for the specified employee and date range
    const report = await Attendance.aggregate([
      {
        $addFields: {
          parsedDate: {
            $convert: {
              input: "$date",
              to: "date",
              onError: null, // In case of conversion failure, use null
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $ne: ["$parsedDate", null] }, // Exclude documents where parsing failed
              { $eq: [{ $month: "$parsedDate" }, parseInt(month)] },
              { $eq: [{ $year: "$parsedDate" }, parseInt(year)] },
              { $eq: ["$employeeId", id] }, // Filter by employee ID
            ],
          },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          present: {
            $sum: {
              $cond: { if: { $eq: ["$status", "present"] }, then: 1, else: 0 },
            },
          },
          absent: {
            $sum: {
              $cond: { if: { $eq: ["$status", "absent"] }, then: 1, else: 0 },
            },
          },
          halfday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "halfday"] }, then: 1, else: 0 },
            },
          },
          holiday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "holiday"] }, then: 1, else: 0 },
            },
          },
        },
      },
      {
        $lookup: {
          from: "employees", // Name of the employee collection
          localField: "_id",
          foreignField: "employeeId",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails", // Unwind the employeeDetails array
      },
      {
        $project: {
          _id: 1,
          present: 1,
          absent: 1,
          halfday: 1,
          name: "$employeeDetails.employeeName",
          designation: "$employeeDetails.designation",
          salary: "$employeeDetails.salary",
          employeeId: "$employeeDetails.employeeId",
        },
      },
    ]);

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ message: "Error generating the report" });
  }
};

export const getAdvanceOrLoanReport = async (req, res) => {
  try {
    const { id } = req.params;
    const advance = await Attendance.find({ employeeId: id });

    if (!advance) {
      return res.status(404).json({ message: "Advance not found" });
    }

    return res.status(200).json({ advance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get attendance by id
export const getAttendanceById = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    const attendance = await Attendance.find({ employeeId: id });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    return res.status(200).json({ attendance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
