var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //automatically requires index file

//INDEX show all campgrounds
router.get("/", function(req, res) {

   Campground.find({}, function(err, allCampgrounds) {
      if (err) {
         console.log(err);
      }
      else {
         res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
      }
   });
});


//CREATE campground
router.post("/", middleware.isLoggedIn, function(req, res) {
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var price = req.body.price;
   var author = {
      id: req.user._id,
      username: req.user.username
   }
   var newCampground = { name: name, image: image, description: description, author: author, price: price };

   Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
         console.log(err);
      }
      else {
         res.redirect("/campgrounds");
      }

   });

});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");

});


//SHOWS more info about one campground
router.get("/:id", function(req, res) {
   //find campground with id 

   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if (err) {
         console.log(err);
      }
      else {
         //render show template

         res.render("campgrounds/show", { campground: foundCampground });
      }
   });
});


//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
      res.render("campgrounds/edit", { campground: foundCampground });
      //res.render("../views/campgrounds/edit", {campground: foundCampground});

   });

});


//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {

   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {

      res.redirect("/campgrounds/" + updatedCampground._id);


   });


});


//DELETE/DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {

   Campground.findByIdAndRemove(req.params.id, function(err) {

      res.redirect("/campgrounds");

   });

});







module.exports = router;
