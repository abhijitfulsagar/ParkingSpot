var mongoose=require("mongoose");
//schema setup
var campSchema=new mongoose.Schema({
    name:String,
    price:String,
    image1:String,
    image2:String,
    image3:String,
    location:String,
    startTime:String,
    endTime:String,
    createdAt:{type:Date,default:Date.now},
    availability:[],
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
    ],
    booked:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Bookdates"
        } 
    ]
});

//DATA MODEL    
module.exports=mongoose.model("Parking",campSchema);