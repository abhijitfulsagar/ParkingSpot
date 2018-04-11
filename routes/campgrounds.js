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


router.post("/index",isLoggedIn,function(req,res){
    var location=req.body.placeName;
    var imageURL=req.body.imgName;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var object={name:location,image:imageURL,author:author,description:desc};
    Campground.create(object,function(err,results){
        if(err){
            console.log(err);
        }else{
          
            res.redirect("/index");
        }
    });
    
});

router.get("/index/new",isLoggedIn,function(req, res) {
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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports=router;