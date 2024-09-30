import express from "express";
import { createAdvance, getAdvanceById } from "../controllers/advance.controller.js";

const router = express.Router();

//endpoint to create advance
router.post("/new", createAdvance)

//get advance by id
router.get("/:id", getAdvanceById)

export default router 