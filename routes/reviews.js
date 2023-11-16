const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

const reviewsCtrl = require('../controllers/reviews');

// creating the review route
router.post(
    '/',
    validateReview, 
    isLoggedIn,
    catchAsync(reviewsCtrl.createReview)
);

// delete Review 
router.delete(
    '/:reviewId', 
    isReviewAuthor,
    isLoggedIn,
    catchAsync(reviewsCtrl.deleteReview)
);

module.exports = router;