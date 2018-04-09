var mongoose=require("mongoose");
//schema setup
var campSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"   //this is the name of model
        }
    ]
});

//DATA MODEL    
module.exports=mongoose.model("Campground",campSchema);