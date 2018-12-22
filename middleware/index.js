//all the middleware
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                //does user own campground?
                req.campground = foundCampground;
                next();
            }
            else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");

            }

        });

    }
    else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back"); //returns to previous page 

    }

}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                console.log(err);
                req.flash('error', 'Sorry, that comment does not exist!');
                res.redirect('/campgrounds');
            }
            else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                req.comment = foundComment;
                next();
            }
            else {
                req.flash('error', 'You don\'t have permission to do that!');
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back"); //returns to previous page
    }


}


//middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}


module.exports = middlewareObj;
