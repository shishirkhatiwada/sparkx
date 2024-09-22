import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const protectedRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.accessToken
        if(!token)
            return res.status(400).json({data: "Unauthorized: token is not provided"})

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode)
            return res.status(400).json({error : "unauthorized: Invalid token"})

        const user = await User.findById(decode.userId).select("-password")

        if(!user)
            return res.status(400).json({error: "User not found"})

        req.user = user
        next()

    } catch (error) {
        console.log("Error in the middleware");
        
    }

}