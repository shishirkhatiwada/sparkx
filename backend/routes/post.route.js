import express from "express"
import { protectedRoute } from "../middlewares/protectedRoute.js"
import { createPost, deletePost , commentOnPost, likeUnlikePost, getAllPost, getLikesPosts, getFollowingPosts, getUserPost} from "../controllers/post.controller.js"

const router = express.Router()



router.get("/all", protectedRoute, getAllPost)
router.get("/user/:username", protectedRoute, getUserPost)
router.get("/following", protectedRoute, getFollowingPosts)
router.get("/likes/:id", protectedRoute, getLikesPosts)
router.post("/create", protectedRoute, createPost)
router.post("/like/:id", protectedRoute, likeUnlikePost)
router.post("/comment/:id", protectedRoute, commentOnPost)
router.delete("/:id", protectedRoute, deletePost)



export default router