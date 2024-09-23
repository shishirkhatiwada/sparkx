import { json } from "express"
import User from "../models/user.model.js"
import Notification from "../models/norification.model.js"
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from "cloudinary"


export const getUserProfile = async (req,res)=>{
    const {username} = req.params
    try {
        const user = await User.findOne({username})
        if(!user) return res.status(400).json({error: "User not found"})

        res.status(200).json(user)
    } catch (error) {
        console.log("Somethins is wrong in user controller");
        
        return res.status(500).json({error: error.message})
    }
}

export const followUnfollowUSer = async (req, res)=>{
    try {
        const {id} = req.params

        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if(id === req.user._id.toString()) {
            return res.status(400).json({error: "You cannot fllow or unfollow yourself"})
        }
      
        if(!userToModify || !currentUser) return res.status(400).json({error: "USer does not exist"})

        const isFollowing = currentUser.following.includes(id)

        if(isFollowing){
            //unfollow the user
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}})
            res.status(200).json({message: "Unfollowed successfully"})
        }else{
            //follow the user
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}})

            const newNotification = new Notification({
                type:'follow',
                from: req.user._id,
                to: userToModify.id
            })

            await newNotification.save()
            //TODO: send notification
            res.status(200).json({message: "User followed successfully"})
        }

    } catch (error) {
        console.log("Somethins is wrong in follower controller");
        
        return res.status(500).json({error: error.message})
    }
}

export const getSuggestedProfile = async(req,res)=>{
try {
    const userId = req.user._id

    const usersFollowedByMe = await User.findById(userId).select("following")

    const users = await User.aggregate([{
        $match:{
            _id: { $ne: userId},
        }, },
        {$sample: {size: 10}},
    ])

    const filteredUser = users.filter((user)=> !usersFollowedByMe.following.includes(user._id))
    const suggestedUsers = filteredUser.slice(0,4)

    suggestedUsers.forEach((user)=>(user.password = null))
    return res.status(200).json(suggestedUsers)

} catch (error) {
    console.log("Error in getting users : " , error.message);
    return res.status(500).json({error: "Internal server error"})
    
}
}


export const updateUser = async (req,res)=>{
    const {fullname ,username, email, currentPassword, newPassword, bio, links} = req.body
    let {profileImg, coverImg} = req.body
    const userId = req.user._id
    try {
        let user = await User.findById(userId)
        if(!user) return res.status(400).json({error: "User not found"})

        if((!currentPassword && newPassword) || (!newPassword && currentPassword) )
            return res.status(400).json({error: "Please provide both current and new password"})

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch) return res.status(400).json({error: "Current password did not macth"})
            if(newPassword.length <6) return res.status(400).json({error:"Password must be 6 characters long"})
            
            const salt = await bcrypt.genSalt(10)


            user.password = await bcrypt.hash(newPassword, salt)
        }

        if(profileImg){

            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
         const uplaodResponse  =   await cloudinary.uploader.upload(profileImg)
         profileImg = uplaodResponse.secure_url

        }

        if(coverImg){

            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }

            const uplaodResponseCover  =   await cloudinary.uploader.upload(coverImg)
            coverImg = uplaodResponse.secure_url        }



        user.fullname = fullname || user.fullname
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = links || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()

        //this will return password as null i response
        user.password = null

        return res.status(200).json({message: "User updated successfully", user});

    } catch (error) {
        console.log("Error in update user", error.message);
        return res.status(500).json({error:"Server error"})
        
    }
}