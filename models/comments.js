 var mongoose=require("mongoose");

var commentSchema=new mongoose.Schema({
    text:String,
    author:String
});

//this name "Comment" is the name of model which is used as ref when declaring the schema for campgrounds in comments array
module.exports=mongoose.model("Comment",commentSchema);