var express=require("express");
var Parking=require("../models/campgrounds");
var Book=require("../models/book");
var middleware=require("../middleware/middleware");
var router=express.Router();

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/",function(req, res) {
    res.render("landing");
}); 

router.get("/index",function(req, res) {
    Parking.find({},function(err,results){
        if(err){
            console.log("No such parking spot exists");
            console.log(err);
        }else{
            console.log("Successfully found all the parking spots!!!");
            res.render("campgrounds/index",{data:results});
        }
    });
});

//CREATE - add new PARKING to DB
router.post("/index", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.placeName;
  var image1 = req.body.imgName1;
  var image2 = req.body.imgName2;
  var image3 = req.body.imgName3;
  var startTime =req.body.startTime;
  var endTime =req.body.endTime;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newParkingSpot = {name: name, image1: image1,image2:image2,image3:image3,startTime:startTime,endTime:endTime,availability:req.body.avail, price:price,description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Parking.create(newParkingSpot, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/index");
        }
    });
  });
});

router.get("/index/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route
router.get("/index/:id",function(req, res) {
    Parking.findById(req.params.id).populate("comments").exec(function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log("Opened the required parking spot!!!");
            res.render("campgrounds/show",{parking:result});
        } 
    });
   
});

//EDIT PARKING
router.get("/index/:id/edit",middleware.checkUserOwnership,function(req, res) {
   
        Parking.findById(req.params.id,function(err,foundParkingSpot){
            res.render("campgrounds/edit",{parking:foundParkingSpot});
        });    
});

// UPDATE PARKING ROUTE
router.put("/index/:id", middleware.checkUserOwnership, function(req, res){
  geocoder.geocode(req.body.data.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }else{
        req.body.data.lat = data[0].latitude;
        req.body.data.lng = data[0].longitude; 
        req.body.data.location = data[0].formattedAddress; 
        Parking.findByIdAndUpdate(req.params.id, req.body.data, function(err, parking){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/index/" + parking._id);
            }
        });
    }
  });
});

//DELETE 
router.delete("/index/:id",middleware.checkUserOwnership,function(req,res){
    Parking.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error","Something went wrong deleting the parking spot!!!");
            res.redirect("/index");
        }else{
            req.flash("success","Successfully deleted the parking spot!!!");
            res.redirect("/index");
        }
    });
});

//BOOK PARKING
router.get("/index/:id/book",middleware.isLoggedIn,function(req, res) {
   
        Parking.findById(req.params.id,function(err,foundParkingSpot){
            res.render("campgrounds/book",{parking:foundParkingSpot});
        });    
});

router.post("/index/:id/book",middleware.isLoggedIn,function(req, res){
    Parking.findById(req.params.id,function(err, foundParkingSpot) {
        if(err){
            res.redirect("/index/"+req.params.id);
        }else{
            console.log("The type is:"+typeof(req.body.data.bookdate));
            Book.create(req.body.data,function(err,dateBooked){
                if(err){
                    req.flash("error","Error in booking for that date");
                    res.redirect("/index/"+foundParkingSpot._id);
                }else{
                    dateBooked.renterInfo.id=req.user._id;
                    dateBooked.renterInfo.username=req.user.username;
                    dateBooked.save();
                    foundParkingSpot.booked.push(dateBooked);
                    foundParkingSpot.save();   
                    req.flash("success","Successfully booked "+foundParkingSpot.name+" on "+dateBooked.bookdate);
                    res.redirect("/index/"+foundParkingSpot._id);
                }
            });
        }
    });
   
});

module.exports=router;