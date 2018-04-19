var express                 =require("express"),
    app                     =express(),
    bodyParser              =require("body-parser"),
    mongoose                =require("mongoose"),
    passport                =require("passport"),
    passportLocal           =require("passport-local"),
    methodOverride          =require("method-override"),
    passportLocalMongoose   =require("passport-local-mongoose"),
    User                    =require("./models/users"),
    Campground              =require("./models/campgrounds"),
    Comment                 =require("./models/comments"),
    seedDB                  =require("./seeds.js");
   
var commentRoutes       =require("./routes/comments"),
    campgroundRoutes    =require("./routes/campgrounds"),
    authenticationRoutes=require("./routes/authentication");
 
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"I love dogs",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is a middleware which will run for every route. It passes the current user name and id
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

mongoose.connect("mongodb://localhost/yamp_camp");
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//clears the database    
//seedDB();

app.use(authenticationRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("YelpMe App has started");
});