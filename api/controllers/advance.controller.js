import { create } from "react-test-renderer";
import Advance from "../models/advance.model.js";

export const createAdvance = async (req, res) => {
  const { employeeId, advanceAmount, date, extraBonus } = req.body;

  try {
    const advance = new Advance({
      employeeId: employeeId,
      date: date,
      advanceAmount: advanceAmount,
      extraBonus: extraBonus,
    });
    const newAdvance = await advance.save();
    return res.status(201).json({ newAdvance });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get advance by id
export const getAdvanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const advance = await Advance.find({ employeeId: id }).sort({createdAt: -1});
    if (!advance) {
      return res.status(404).json({ message: "Advance not found" });
    }
    return res.status(200).json({ advance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
