import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
text: {
    type: String,
},
img: {
    type: String,
    
},
likes:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
}],
comments: [{
    user: {  // Reference to the User who made the comment
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {  // The actual comment text
        type: String,
        required: true
    }
}]
},{timestamps:true})

const Posts = mongoose.model("Posts", postSchema)

export default Posts