import express from "express";
import { isAdminRoute, protectRoute,isSupRoute } from "../middleware/authMiddleware.js"
import { createTask,validateTask,getTaskEvaluation, postTaskActivity, dashboardStatistics, getTasks, getTask, createSubTask, updateTask, trashTask } from "../controllers/taskController.js";
const router = express.Router()

router.post("/create", protectRoute, isSupRoute, createTask);

router.post("/activity/:id", protectRoute, postTaskActivity);
router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);
router.get("/opentaskevaluation/:id", protectRoute, getTaskEvaluation);
router.put("/validate-Task/:id", protectRoute, isSupRoute, validateTask)
router.put("/create-subtask/:id", protectRoute,  createSubTask);
router.put("/update/:id", protectRoute, isSupRoute, updateTask);
router.delete("/:id", protectRoute, isSupRoute, trashTask);



export default router