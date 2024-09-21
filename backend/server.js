import express from "express"
import authRoute from "./routes/auth.route.js"
import dotenv from "dotenv"
import connectionMongoose from "./db/connection.js"

const app = express()
dotenv.config()

const port = process.env.PORT


app.use("/api/auth", authRoute)

app.listen(port, ()=>{
    console.log(`Port is running on ${port}`);
    connectionMongoose()
    
})