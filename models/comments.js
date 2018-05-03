 var mongoose=require("mongoose");

var commentSchema=new mongoose.Schema({
    text:String,
    createdAt:{type:Date,default:Date.now},
     author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//this name "Comment" is the name of model which is used as ref when declaring the schema for campgrounds in comments array
module.exports=mongoose.model("Comment",commentSchema);