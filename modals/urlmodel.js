const mongoose=require("mongoose");

const urlSchema  =new mongoose.Schema({
    shortid:String,
    originalUrl:{
        type: String,
        required:true
    },
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usermodel',
    required: true
  }
})

const urlmodel=mongoose.model('urlmodel',urlSchema);
module.exports={urlmodel};