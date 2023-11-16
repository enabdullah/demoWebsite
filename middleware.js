const {campgroundSchema,reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');



module.exports.isLoggedIn = (req, res, next) => {
    // add the isAuthenticated method from passport
    console.log('Req.User', req.user); // this is will print me the user info stored in session
    if(!req.isAuthenticated()) {
        console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'you must be sined In');
        res.redirect('/login');
    }else {
        next();
    }
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


// Write Middleware function to be used in muilti route
module.exports.vaildateCampground = (req,res,next) => {
    // add the error handle for all input
    // this is will prevent send request from postman
    // vaildation in server side by using external package name Joi
    // the schema through to seperate file as schemas.js
    //const result = campgroundSchema.validate(req.body);
    //console.log(result);
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}

// Write Middleware function to be used in muilti route
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}

// Write Middleware function to be used to check the user and own post
// this is belong to campground
module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!(campground.author.equals(req.user._id))) {
        req.flash('error','You are not allowed to do that');
        res.redirect(`/campgrounds/${campground._id}`);
    } else {
        next();
    }
}

// Write Middleware function to be used to check the user and own post
// this is belong to Review

module.exports.isReviewAuthor = async(req,res,next) => {
    const {id ,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!(review.author.equals(req.user._id))) {
        req.flash('error','You are not allowed to do that');
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}


