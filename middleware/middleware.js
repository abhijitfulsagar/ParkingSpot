var Campground      =require("../models/campgrounds");
var Comment         =require("../models/comments");
var middlewareObject={}

middlewareObject.checkCommentOwnership=function (req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,foundComment){
           if(err){
               res.redirect("/index");
            } else{
                 //does the user own the authorization to edit comment
                 if(foundComment.author.id.equals(req.user._id)){
                     next();
                 }else{
                     req.flash("error","You do not have permission to do that ");
                     res.redirect("back");
                 }
            }    
        });    
    }else{
        req.flash("error","You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObject.checkUserOwnership=function(req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
           if(err){
               req.flash("error","Campground not found");
               res.redirect("/index");
            } else{
                 //does the user own the authorization
                 if(foundCampground.author.id.equals(req.user._id)){
                     next();
                 }else{
                     req.flash("error","You do not have permission to do that ");
                     res.redirect("back");
                 }
            }    
        });    
    }else{
        req.flash("error","You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn =function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in!");
    res.redirect("/login");
};


module.exports=middlewareObject;