const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const usersCtrl = require('../controllers/users');


// we can make the routes grouping the smillar by route

router.route('/register')
    .get(usersCtrl.registerRenderPage)
    .post(catchAsync(usersCtrl.registerUser));


router.route('/login')
    .get(usersCtrl.loginRenderPage)
    .post(
        storeReturnTo, 
        passport.authenticate(
            'local', {
                failureFlash: true,
                failureRedirect: '/login'
        }),
        usersCtrl.userLogIn
    );


router.get('/logout', usersCtrl.userLogOut); 



module.exports = router

/*
router.get('/register', usersCtrl.registerRenderPage);

router.post(
    '/register', 
    catchAsync(usersCtrl.registerUser)
);

router.get('/login', usersCtrl.loginRenderPage);

// passport.authenticate, this is meddileware from passport
// the passport will check it automaciclly
router.post(
    '/login',
    storeReturnTo, 
    passport.authenticate(
        'local', {
            failureFlash: true,
            failureRedirect: '/login'
    }),
    usersCtrl.userLogIn
);

// logout
router.get('/logout', usersCtrl.userLogOut); 


module.exports = router
*/