var mongoose=require("mongoose");

var bookSchema=new mongoose.Schema({
    renterInfo:{
         id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    phoneNumber:Number,
    bookdate:String
});

module.exports=mongoose.model("Bookdates",bookSchema);