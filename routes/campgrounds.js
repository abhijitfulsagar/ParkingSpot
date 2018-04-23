var express=require("express");
var Campground=require("../models/campgrounds");
var middleware=require("../middleware/middleware");
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


router.post("/index",middleware.isLoggedIn,function(req,res){
    var location=req.body.placeName;
    var price=req.body.price;
    var imageURL=req.body.imgName;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var object={name:location,price:price,image:imageURL,author:author,description:desc};
    Campground.create(object,function(err,results){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Successfully added a campground to database!!!");
            res.redirect("/index");
        }
    });
    
});

router.get("/index/new",middleware.isLoggedIn,function(req, res) {
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

//EDIT CAMPGROUND
router.get("/index/:id/edit",middleware.checkUserOwnership,function(req, res) {
   
        Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
        });    
});

//UPDATE CAMPGROUND
router.put("/index/:id",middleware.checkUserOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.data,function(err,updatedCampground){
         if(err){
               console.log("Something went wrong in updating!!!!!");
               req.flash("error","Something went wrong updating the campground!!!");
               res.redirect("/index");
            }else{
                console.log("Successfully updated!!!!!!");
                req.flash("success","Successfully updated the campground!!!");
                res.redirect("/index/"+req.params.id);
            } 
    });
});

//DELETE 
router.delete("/index/:id",middleware.checkUserOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error","Something went wrong deleting the campground!!!");
            res.redirect("/index");
        }else{
            req.flash("success","Successfully deleted the campground!!!");
            res.redirect("/index");
        }
    });
});

module.exports=router;