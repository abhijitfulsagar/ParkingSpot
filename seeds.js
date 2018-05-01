var mongoose=require("mongoose");
var Parking=require("./models/campgrounds");
var Comment=require("./models/comments.js");

var data=[
        {name:"Californai", image:"https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg", description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."},
        {name:"Arizona", image:"http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg", description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."},
        {name:"Texas", image:"https://res.cloudinary.com/simpleview/image/fetch/c_fill,f_auto,h_452,q_75,w_982/http://res.cloudinary.com/simpleview/image/upload/v1469218578/clients/lanecounty/constitution_grove_campground_by_natalie_inouye_417476ef-05c3-464d-99bd-032bb0ee0bd5.png", description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident "},
        {name:"Colorado", image:"https://acadiamagic.com/280x187/md-campground.jpg", description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."},
        {name:"Florida", image:"https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5306226.jpg", description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."}
    ]
function seedDB(){
    
    //this will clear all the data from database and add new campgrounds to database
    Parking.remove({},function(err){
        if(err){
            console.log(err);
        }
         //add few campgrounds
        data.forEach(function(seed){
             Parking.create(seed,function(err,parkingSpot){
                if(err){
                    console.log(err);
                }else{
                    console.log("Parking spot added");
                    
                    //adding comments to each campground
                    Comment.create(
                        {
                            text:"This place is beautiful. Should always come to visit this place.",
                            author:"Abhijit Fulsagar"
                        } ,function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                parkingSpot.comments.push(comment);
                                parkingSpot.save();
                                console.log("Comment added");
                            }
                    });
                }
             });
        });
    });
    
    //add comments
}

module.exports=seedDB;