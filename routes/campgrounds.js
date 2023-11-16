const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor,vaildateCampground} = require('../middleware');
const campgroundsCtrl = require('../controllers/campgrounds');
const { route } = require('./reviews');
const multer  = require('multer');
const {storage} = require('../cloudinary/index');
//const upload = multer({ dest: 'uploads/' }); stored locally
const upload = multer({ storage });




// we can make the routes grouping the smillar by route


router.route('/')
    .get(catchAsync(campgroundsCtrl.index))
    //.post(isLoggedIn,vaildateCampground,catchAsync(campgroundsCtrl.createCampground))
    //.post(upload.single('images'),(req,res) => {
    //.post(upload.array('images'),(req,res) => {
        //console.log(req.body, req.files) // need to install multer package
        // now print me the array
        //res.send('it is worked')
    //})
    .post(
        isLoggedIn,
        upload.array('images'),
        vaildateCampground,
        catchAsync(campgroundsCtrl.createCampground)
    )


router.get('/new',isLoggedIn, campgroundsCtrl.renderNewForm)
// finding for update by id


router.route('/:id')
    .get(catchAsync(campgroundsCtrl.showCampground))
    //.put(isLoggedIn,isAuthor,vaildateCampground, catchAsync(campgroundsCtrl.updateCampground))
    .put(
        isLoggedIn,
        isAuthor,
        upload.array('images'),
        vaildateCampground,
        catchAsync(campgroundsCtrl.updateCampground)
    )
    .delete(
        isLoggedIn,
        isAuthor,
        catchAsync(campgroundsCtrl.deleteCampground)
        )

router.get(
    '/:id/edit',
    isLoggedIn, 
    isAuthor,
    catchAsync(campgroundsCtrl.renderEditForm)
);


module.exports = router;

/*
router.get('/', catchAsync(campgroundsCtrl.index));

router.get('/new',isLoggedIn, campgroundsCtrl.renderNewForm);

router.post(
    '/',
    isLoggedIn,
    vaildateCampground, 
    catchAsync(campgroundsCtrl.createCampground)
);

router.get('/:id',catchAsync(campgroundsCtrl.showCampground));

// finding for update by id
router.get(
    '/:id/edit',
    isLoggedIn, 
    isAuthor,
    catchAsync(campgroundsCtrl.renderEditForm)
);

// Editing Route by put
router.put(
    '/:id',
    isLoggedIn,isAuthor,
    vaildateCampground, 
    catchAsync(campgroundsCtrl.updateCampground)
);


// Deleting the Route by delete
router.delete(
    '/:id', 
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsCtrl.deleteCampground)
);



module.exports = router;
*/