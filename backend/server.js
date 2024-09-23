import express, { urlencoded } from "express"
import dotenv from "dotenv"
import connectionMongoose from "./db/connection.js"
import cookieParser from "cookie-parser"

import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.route.js"
import notificationRoute from "./routes/notification.route.js"

import {v2 as cloudinary} from "cloudinary"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())

cloudinary.config({
   cloud_name : process.env.CLOUDINARY_CLOUDNAME,
   api_key : process.env.CLOUDINARY_API_KEY,
   api_secret : process.env.CLOUDINARY_API_SECRET
})

app.use(express.urlencoded({extended:true}))

const port = process.env.PORT


app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/notifications", notificationRoute )

app.listen(port, ()=>{
    console.log(`Port is running on ${port}`);
    connectionMongoose()
    
})