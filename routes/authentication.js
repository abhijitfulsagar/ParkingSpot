var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/users");

//show register form
router.get("/register",function(req, res) {
    res.render("register");
});


//signup logic
router.post("/register",function(req, res) {
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to ParkingSpot "+ user.username);
            res.redirect("/index");
        });
    });
});
 
//LOGIN routes
router.get("/login",function(req, res) {
    res.render("login");
});

router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/index",
        failureRedirect:"/login"
    }),function(req, res) {
});

//LOGOUT route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged you out!!!");
    res.redirect("/index");
});


module.exports=router;