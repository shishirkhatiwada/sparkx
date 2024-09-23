import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from '../lib/util/generateToken.js'

export const register = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;

        // Email format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }


        if(password.length <6)
            return res.status(400).json({data: "Password must be 6 character"})

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        });

        // Save new user and respond
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res); // Assuming generateTokenAndSetCookie is defined elsewhere
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,  // Fixed typo from useename to username
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            });
        } else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.error("Error in sign up controller:", error);  // More specific error logging
        return res.status(500).json({ error: "Something went wrong on the server" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists first
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Username not found" });
        }

        // Now check if the password is correct
        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        generateTokenAndSetCookie(user._id, res); 

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username, 
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        });
    } catch (error) {
        console.error("Error in login controller:", error);  // More specific error logging
        return res.status(500).json({ error: "Something went wrong on the server" });
    }
};


export const logout = async (req, res) => {
    try{
        res.cookie("accessToken", "", {maxAge: 0})
        res.status(200).json({data: "Loggedout successfully"})
    } catch(error){
        console.error("Error while logging out:", error);  // More specific error logging
        return res.status(500).json({ error: "Something went wrong on the server" });
    }
};

export const getMe = async (req,res)=>{
    try{
        const user = await User.findOne(req.user._id).select("-password")
        res.status(200).json(user)
    }
    catch(error){
        console.error("Error while getting user:", error);  // More specific error logging
        return res.status(500).json({ error: "Something went wrong on the server" });    }
}
