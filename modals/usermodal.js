const mongoose=require("mongoose");

const schema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { type: String, required: true },
    password:{
        type: String,
        required: true
    }
});
const usermodel=mongoose.model('usermodel',schema);
module.exports={usermodel};