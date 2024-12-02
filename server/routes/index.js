import express from "express";
import userRoutes from "./userRoutes.js"
import taskRoutes from "./taskRoutes.js"
import chatRoutes from "./chatRoutes.js"

const router = express.Router()

router.use("/user",userRoutes)
router.use("/task",taskRoutes)
router.use("/chat",chatRoutes)


export default router