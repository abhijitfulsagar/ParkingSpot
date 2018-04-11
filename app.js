var express                 =require("express"),
    app                     =express(),
    bodyParser              =require("body-parser"),
    mongoose                =require("mongoose"),
    passport                =require("passport"),
    passportLocal           =require("passport-local"),
    passportLocalMongoose   =require("passport-local-mongoose"),
    User                    =require("./models/users"),
    Campground              =require("./models/campgrounds"),
    Comment                 =require("./models/comments"),
    seedDB                  =require("./seeds.js");
    
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


//clears the database    
seedDB();


app.get("/",function(req, res) {
    res.render("landing");
}); 

app.get("/index",function(req, res) {
    Campground.find({},function(err,results){
        if(err){
            console.log("No such campgrounds exists");
            console.log(err);
        }else{
            console.log("Successfully found the campgrounds!!!");
            res.render("campgrounds/index",{data:results,currentUser:req.user});
        }
    });
});


app.post("/index",function(req,res){
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

app.get("/index/new",function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route
app.get("/index/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log("Opened the required campground!!!");
            res.render("campgrounds/show",{campgroundId:result});
        } 
    });
   
});

//===========================
//COMMENTS ROUTE
//===========================
app.get("/index/:id/comments/new",isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:foundCampground});        
        }
    });
});

app.post("/index/:id/comments",isLoggedIn,function(req,res){
    //find the correct campground
   Campground.findById(req.params.id,function(err, foundCampground) {
       if(err){
           console.log(err);
           res.redirect("/index");
       }else{
           //create a comment
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               }else{
                   //adding the comment to comments array of that particular campground
                   foundCampground.comments.push(comment);
                   foundCampground.save();
                   //final step is to redirect
                   res.redirect("/index/"+foundCampground._id);
               }
           });
       }
   });
});

//========================
//AUTH ROUTES
//=======================

//show register form
app.get("/register",function(req, res) {
    res.render("register");
});


//signup logic
app.post("/register",function(req, res) {
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
app.get("/login",function(req, res) {
    res.render("login");
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/index",
        failureRedirect:"/login"
    }),function(req, res) {
});

//LOGOUT route
app.get("/logout" ,function(req, res) {
    req.logout();
    res.redirect("/index");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("YelpMe App has started");
});