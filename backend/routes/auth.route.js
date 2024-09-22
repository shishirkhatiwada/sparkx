import express from "express"
import { getMe, login, logout, register } from "../controllers/auth.controller.js"
import { protectedRoute } from "../middlewares/protectedRoute.js"

const router = express.Router()

router.get("/me", protectedRoute ,getMe)
router.post("/signup", register)
router.post("/signin", login)
router.post("/logout", logout)


export default router