const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log('Database Connected')
});

/*
const sample = (array) => {
    array[Math.floor(Math.random() * array.length)];
}
*/
const sample = array => array[Math.floor(Math.random() * array.length)];

console.log('sample(descriptors)');
console.log(`${sample(descriptors)}, ${sample(places)}`);

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        //const imageRD = Math.floor(Math.random() * 49) + 1;
        const priceRD = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '654e9fd460c752dbb3b62df9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            //image: `https://source.unsplash.com/random?nature=${imageRD}`,
            description: 'this is the demo description only',
            price: priceRD,
            //geometry: {type: "Point",coordinates: [39.165361, 21.581009]},
            geometry: {
              type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            ]
          },
            images: [
                {
                  url: 'https://res.cloudinary.com/ds4zgwu4o/image/upload/v1699888356/myYelpCamp/hl6lwboy6shsjvx1p3bg.jpg',
                  filename: 'myYelpCamp/hl6lwboy6shsjvx1p3bg',
                },
                {
                  url: 'https://res.cloudinary.com/ds4zgwu4o/image/upload/v1699888356/myYelpCamp/p3v0cqqkfh1rsvp304ka.jpg',
                  filename: 'myYelpCamp/p3v0cqqkfh1rsvp304ka',
                },
                {
                  url: 'https://res.cloudinary.com/ds4zgwu4o/image/upload/v1699888356/myYelpCamp/h3mthxczyes5xhipa1ch.jpg',
                  filename: 'myYelpCamp/h3mthxczyes5xhipa1ch',
                }
              ],
            
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})