const mongoose=require("mongoose");

async function connectDB(url){
    mongoose.connect(url).then(()=>console.log("database connected"));
}
module.exports=connectDB;