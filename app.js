require('dotenv').config();
var express                 =require("express"),
    app                     =express(),
    $                       = require("jquery"),
    bodyParser              =require("body-parser"),
    mongoose                =require("mongoose"),
    passport                =require("passport"),
    flash                   =require("connect-flash"),
    passportLocal           =require("passport-local"),
    methodOverride          =require("method-override"),
    passportLocalMongoose   =require("passport-local-mongoose"),
    User                    =require("./models/users"),
    Parking                 =require("./models/campgrounds"),
    Comment                 =require("./models/comments"),
    seedDB                  =require("./seeds.js");
    
   
var commentRoutes       =require("./routes/comments"),
    parkingRoutes    =require("./routes/campgrounds"),
    authenticationRoutes=require("./routes/authentication");
 
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"I love dogs",
    resave:false,
    saveUninitialized:false
}));
app.locals.moment = require("moment");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/yamp_camp");
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

//this is a middleware which will run for every route. It passes the current user name and id
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


//clears the database    
//seedDB();

app.use(authenticationRoutes);
app.use(parkingRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("ParkingSpot App has started");
});