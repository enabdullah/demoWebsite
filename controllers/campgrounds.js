const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const eocoder = mbxGeocoding({accessToken: mapBoxToken});



module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req,res) => {
    //console.log('new')
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res,next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    // make the flash
    // make the eocoder // https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode
    const geoData = await eocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    //console.log(geoData);
    //console.log(geoData.body.features);
    //res.send(geoData.body.features[0].geometry.coordinates); // [lat,long] [48.8534951,2.3483915]
    const campground = new Campground(req.body.campground);
    // add the geometry from our model
    campground.geometry = geoData.body.features[0].geometry;
    // from the multer and cloundary array will get the info
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    console.log(campground.geometry);
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req,res) => {
    const {id} = req.params;
    //const campground = await Campground.findById(id);
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // belong to review msg
        }
    }).populate('author');
    //console.log(campground);
    //console.log(campground);
    // add the flash error
    if(!campground) {
        req.flash('error','Can not find that Campground!');
        res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/show', {campground});
    }
}

module.exports.renderEditForm = async (req,res) => {
    //res.send("hello")
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error','Can not find that Campground!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req,res) => {
    //res.send('Edited');
    const {id} = req.params;
    //console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    const delImg = req.body.deleteImages;
    if(delImg){
        for(let filename of delImg) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: delImg}}}})
        console.log(campground);
    }
    req.flash('success','Successfully updating campground');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.deleteCampground =async (req,res) => {
    const {id} = req.params;
    const imgs = req.files;
    const campground = await Campground.findById(id);
    for(let img of campground.images) {
        console.log(img.filename);
        await cloudinary.uploader.destroy(img.filename);
    }
    await Campground.findByIdAndDelete(id); 
    req.flash('success','Successfully deleted Campround');
    res.redirect(`/campgrounds`);
}