import Notification from "../models/norification.model.js"

export const getNotification = async (req,res)=>{
    try {
        const userId = req.user._id

        const notifications = await Notification.find({to:userId}).populate({
            path:  "from",
            select:"username profileImg"
        })

        await Notification.updateMany({to:userId}, {read:true})

        return res.status(200).json(notifications)
    } catch (error) {
        console.log("Something went wrong getting notifications " , error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }
}


export const deleteNotification = async (req,res)=>{
    try {
        const userId = req.user._id

        await Notification.deleteMany({to: userId})

        return res.status(200).json({message: "Notification Deleted Successfully"})
    } catch (error) {
        console.log("Something went wrong deleting notifications " , error.message);
        return res.status(500).json({error:"Internal server error"})
    }
}