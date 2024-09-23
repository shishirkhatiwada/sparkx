import express from "express"
import { protectedRoute } from "../middlewares/protectedRoute.js"
import { deleteNotification, getNotification } from "../controllers/notification.controller.js"


const router = express.Router()

router.get("/", protectedRoute, getNotification)
router.delete("/", protectedRoute, deleteNotification)



export default router