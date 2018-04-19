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

//EDIT CAMPGROUND
router.get("/index/:id/edit",checkUserOwnership,function(req, res) {
   
        Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
        });    
});

//UPDATE CAMPGROUND
router.put("/index/:id",checkUserOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.data,function(err,updatedCampground){
         if(err){
             console.log("Something went wrong in updating!!!!!")
               res.redirect("/index");
            }else{
                console.log("Successfully updated!!!!!!")
                
               res.redirect("/index/"+req.params.id);
            } 
    });
});

//DELETE 
router.delete("/index/:id",checkUserOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/index");
        }else{
            res.redirect("/index");
        }
    })
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

function checkUserOwnership(req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
           if(err){
               res.redirect("/index");
            } else{
                 //does the user own the authorization
                 if(foundCampground.author.id.equals(req.user._id)){
                     next();
                 }else{
                     res.send("YOU DO NOT HAVE PERMISSION TO EDIT THE CAMPGROUND");
                 }
            }    
        });    
    }else{
        res.redirect("back");
    }
}


module.exports=router;