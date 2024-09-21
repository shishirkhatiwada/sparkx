import express from "express"
import { login, logout, register } from "../controllers/auth.controller.js"

const router = express.Router()

router.get("/signup", register)

router.get("/signin", login)

router.get("/logout", logout)


export default router