const mongoose=require('mongoose');
const mongouri=process.env.MONGO_URI;
const connectToMongo=async()=>{
    await mongoose.connect(mongouri).then(() => {
        console.log("Connected to MongoDB successfully");
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
        
    
};
module.exports=connectToMongo;