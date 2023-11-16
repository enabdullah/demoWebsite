const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async(req,res) => {
    //res.send('you made it');
    const campground = await Campground.findById(req.params.id);
    const reviewData = new Review(req.body.review);
    reviewData.author = req.user._id;
    campground.reviews.push(reviewData);
    await reviewData.save();
    await campground.save();
    //console.log(data);
    req.flash('success','Created New Review');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.deleteReview = async (req,res) => {
    //res.send('Delete Me');
    const {id, reviewId} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{
        $pull: {reviews: reviewId}
    });
    console.log(campground);
    const review = await Review.findByIdAndDelete(reviewId);
    console.log(review);
    req.flash('success','Successfully deleted my review');
    res.redirect(`/campgrounds/${id}`);
}