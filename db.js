const mongoose=require("mongoose");
mongoose.set("strictQuery",false);



const mongodb_URL=process.env.NODE_URI==="production"?process.env.MONGODB_URI:"mongodb://localhost:27017/GCES";
const connectdb=async(res)=>{
    try {
        await mongoose.connect(mongodb_URL);
        if(mongoose.connection.readyState===2){
            res &&  res.send("Connecting......!")
        }
        if(mongoose.connection.readyState===1){
            res&& res.send("Connected.")
        }
    } catch (error) {
        console.log(error,"connection failed");
       res && res.send("Dis-Connected.")
    }
   
}


module.exports={connectdb,mongoose,}