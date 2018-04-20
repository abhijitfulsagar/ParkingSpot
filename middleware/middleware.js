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
                     res.send("YOU DO NOT HAVE PERMISSION TO EDIT THE COMMENT");
                 }
            }    
        });    
    }else{
        res.redirect("back");
    }
}

middlewareObject.checkUserOwnership=function(req,res,next){
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

middlewareObject.isLoggedIn =function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


module.exports=middlewareObject;