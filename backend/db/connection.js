import mongoose  from "mongoose";

const connectionMongoose  = async()=>{
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connection successful : ${con.connection.host}` );
        
        
    } catch (error) {
        console.log(`Something is wrong with connection : ${error.message} ` );
        
    }
}

export default connectionMongoose