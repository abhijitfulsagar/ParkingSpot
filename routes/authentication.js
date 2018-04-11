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
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
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
router.get("/logout" ,function(req, res) {
    req.logout();
    res.redirect("/index");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports=router;