import Posts from "../models/post.model.js"
import User from "../models/user.model.js"
import Notification from "../models/norification.model.js"
import {v2 as cloudinary} from "cloudinary"

export const createPost = async (req,res)=>{
    try {
        const {text} = req.body
        let {img} = req.body

        const userId = req.user._id.toString()

        const user = await User.findById(userId)
        if(!user) return res.status(404).json({error:"No User Found"})

        if(!text && !img) return res.status(404).json({error:"Please provide text or image"})  
            
        if(img){
            const uploadResponseImg = await cloudinary.uploader.upload(img)
            img  = uploadResponseImg.secure_url

        }    

        const newPost = new Posts({
            user:userId,
            text,
            img
        })

        await newPost.save()
        return res.status(201).json(newPost)

    } catch (error) {
        console.log("Something is wrong in create post", error.message);
        return res.status(500).json({error: "Internal server error"})
        
    }
}

export const deletePost = async (req,res)=>{
    try {
        const post = await Posts.findById(req.params.id)
        if(!post) return res.status(400).json({error: "No Post Found"})

        
        if(post.user.toString() !== req.user._id.toString()) return res.status(400).json({error:"You are not authorized to delete this post"})

            if(post.img){
                const imgId = post.img.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(imgId)

            }

            await Posts.findByIdAndDelete(req.params.id)
            return res.status(200).json({message: "Post has been deleted successfully"})

        } catch (error) {
            console.log("Something is wrong in delete post", error.message);
            return res.status(500).json({error: "Internal server error"})
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body; // Extract the text from the request body
        const postId = req.params.id; // Extract the post ID from the route params
        const userId = req.user._id; // Extract the user ID from the request user object

        if (!text) return res.status(400).json({ error: "Text field is required" });

        const post = await Posts.findById(postId); // Find the post by its ID
        if (!post) return res.status(400).json({ error: "Post not found" });

        // Comment object using userId directly instead of wrapping it in new ObjectId
        const comment = { user: userId, text }; 
        post.comments.push(comment); // Push the comment to the post's comments array

        await post.save(); // Save the updated post
        return res.status(200).json(post); // Return the updated post

    } catch (error) {
        console.log("Something is wrong in comment post", error.message); // Log the error message
        return res.status(500).json({ error: "Internal server error" }); // Return a server error response
    }
};

export const likeUnlikePost = async(req, res)=>{
    try {
        const userId = req.user._id
        const {id:postId} = req.params

        const post = await Posts.findById(postId)
        if(!post) return res.status(400).json({error:"Post not found"})

        
        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost) {
            //this is used for unliking
            await Posts.updateOne({_id:postId}, {$pull: {likes: userId}})
            await User.updateOne({_id:postId}, {$pull: {likedPosts: userId}})
            return res.status(200).json({message:"Unliked"})
        } else{
            post.likes.push(userId)
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}})
            await post.save()

            const newNotification =  new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })

            await newNotification.save()
            return res.status(200).json({message: "Post liked successfully"})
        }

    } catch (error) {
        console.log("Something is wrong in delete post", error.message);
        return res.status(500).json({error: "Internal server error"})
    }
}


export const getAllPost = async(req,res)=>{
    try {
        const posts = await Posts.find().sort({createdAt : -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path:"comments",
            select:"-passoword"
        })

        if(posts.length === 0) return res.status(200).json([])

          
            
        return res.status(200).json(posts)

    } catch (error) {
        console.log("Something is wrong while getting all post", error.message);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const getLikesPosts = async(req,res)=>{
    const userId =req.params.id

    try {
        const user = await User.findById(userId)
        if(!user) return res.status(400).json({error: "User not found"})

        const likedPosts = await Posts.find({_id: {$in: user.likedPosts}}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })

        return res.status(200).json(likedPosts)

    } catch (error) {
        console.log("Something is wrong while getting likedposts", error.message);
        return res.status(500).json({error: "Internal server error"})
    }
}


export const getFollowingPosts = async(req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)

        if(!user) return res.status(400).json({error:"User not found"})

        const following= user.following

        const feedPosts = await Posts.find({user: {$in: following}}).sort({createdAt: -1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })

        return res.status(200).json(feedPosts)


    } catch (error) {
        console.log("Something is wrong while getting following posts", error.message);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const getUserPost = async(req,res)=>{
    const {username} = req.params
    try {
        const user = await User.findOne({username})

        if(!user) return res.status(400).json({error:"User not found"})

        const post = await Posts.find({user: user._id}).sort({createdAt: -1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"user",
            select:"-password"
        })

        return res.status(200).json(post)
    } catch (error) {
        console.log("Something is wrong while getting user posts", error.message);
        return res.status(500).json({error: "Internal server error"})
    }
}