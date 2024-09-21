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
    res.json({
        data: "this is login"
    });
};

export const logout = async (req, res) => {
    res.json({
        data: "this is register"
    });
};
