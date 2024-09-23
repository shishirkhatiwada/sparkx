import express from "express"
import { protectedRoute } from "../middlewares/protectedRoute.js"
import { followUnfollowUSer, getSuggestedProfile, getUserProfile, updateUser } from "../controllers/user.controller.js"

const router = express.Router()


router.get("/profile/:username",protectedRoute, getUserProfile)
router.get("/suggested", protectedRoute, getSuggestedProfile)
router.post("/follow/:id", protectedRoute, followUnfollowUSer)
router.post("/update/", protectedRoute, updateUser)


export default router