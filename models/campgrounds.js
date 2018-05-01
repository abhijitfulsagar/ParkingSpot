var mongoose=require("mongoose");
//schema setup
var campSchema=new mongoose.Schema({
    name:String,
    price:String,
    image1:String,
    image2:String,
    image3:String,
    location:String,
    lat:Number,
    lng:Number,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"   //this is the name of model
        }
    ]
});

//DATA MODEL    
module.exports=mongoose.model("Parking",campSchema);