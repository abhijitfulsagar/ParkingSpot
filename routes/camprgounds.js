var express=require("express");
var Campground=require("../models/campgrounds");
var router=express.Router();


router.get("/",function(req, res) {
    res.render("landing");
}); 

router.get("/index",function(req, res) {
    Campground.find({},function(err,results){
        if(err){
            console.log("No such campgrounds exists");
            console.log(err);
        }else{
            console.log("Successfully found the campgrounds!!!");
            res.render("campgrounds/index",{data:results});
        }
    });
});


router.post("/index",function(req,res){
    var location=req.body.placeName;
    var imageURL=req.body.imgName;
    var desc=req.body.description;
    var object={name:location,image:imageURL,description:desc};
    Campground.create(object,function(err,results){
        if(err){
            console.log(err);
        }else{
            //console.log("Successfully found the campgrounds!!!");
            res.render("campgrounds/index",{data:results});
        }
    });
   // camp.push(object);
    res.redirect("campgrounds/index");
});

router.get("/index/new",function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route
router.get("/index/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log("Opened the required campground!!!");
            res.render("campgrounds/show",{campgroundId:result});
        } 
    });
   
});

module.exports=router;