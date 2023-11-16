

const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//https://res.cloudinary.com/ds4zgwu4o/image/upload/v1699897555/myYelpCamp/tnm4w4jgoyd5ncrgxwqz.jpg

// we need to create the image resize by cloundary 

const ImageSchema = new Schema({
    url: String,
    filename: String,
    
});

// to add the properties of campGroundSchema in campground
const opts = { toJSON: { virtuals: true } };


// virtual only for viewing, not touch any database
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200');
});

const campGroundSchema = new Schema({
    title: String,
    //image: String,
    images: [ImageSchema],
    geometry: { // get it from https://mongoosejs.com/docs/geojson.html
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        },
    ]
}, opts);

// virtual only for campground to show the title of mapbox properties
campGroundSchema.virtual('properties.popMarkup').get(function() {
    //return 'I am Pop Text';
    //return this.title + ' ' + this.location; // refer to title of campground
    return `<strong><a href="campgrounds/${this._id}">
    ${this.title}</a></strong><p>${this.description.substring(0,10)}...</p>`; // refer to title of campground
});



// This function triggers the following middleware.
// findOneAndDelete()
// only used this middlware if findByIdAndDelete(id)
campGroundSchema.post('findOneAndDelete', async function(data) {
    console.log(data);
    if(data){
        await Review.deleteMany({
            _id: {$in: data.reviews}
        })
    }
})

// 654e9fd460c752dbb3b62df9

module.exports = mongoose.model('Campground', campGroundSchema)