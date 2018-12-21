var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");
    
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");


var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);
//mongoose.connect("mongodb://localhost/yelp_camp");  
//mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://Monika:yelpmonika1234@ds241664.mlab.com:41664/yelpcampdb");  
//mongodb://Monika:yelpmonika1234@ds241664.mlab.com:41664/yelpcampdb



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
//seedDB();  


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Yelp camp here we come",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use("/campgrounds", function(req, res, next){
//   console.log("Request: " + req.url); 
//   next();
// });


//so we don't have to pass in currentUser: req.user on every route; 
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("App started");
    
});