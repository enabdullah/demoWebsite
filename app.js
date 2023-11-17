// first need to install the dotenv package 
// then make if condition if i run in develoment
// let me access the dotenv
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const { error } = require('console');
const Joi = require('joi');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratey = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');



// Routes Require
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

//  || 'mongodb://127.0.0.1:27017/yelp-camp'
const dbUrl = process.env.db_URL
//process.env.db_URL || 
const dbPath = dbUrl || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log('Database Connected')
})


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// use to reflect the file in the public folder
//app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname + '/public'));

// To remove data using these defaults:
app.use(mongoSanitize({}));

//const secret = process.env.SECRET || 'thisismysecret';
// add the mongo store to save the session

const mySecret = process.env.SECRET || 'thisshouldbeabettersecret!'
const store = MongoStore.create({
    mongoUrl: dbPath,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: mySecret
    }
});

store.on('error', function(e) {
    console.log('store Error',e);
})


// add the session with cookies
app.use(session({
    store, // this is will create a session db in my yelp-camp
    name: 'websiteCookies',
    secret: mySecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // from https://owasp.org/www-community/HttpOnly
        //secure: true, // only run the http protocal
        expires: (Date.now() + (1000 * 60 * 60 *24 *7)), // after one week will expire from now
        maxAge: (1000 * 60 * 60 *24 *7) // time in milliSecond
        //2023-11-16T19:31:19.814Z
    }
}));

// with deploy security to make website secure
app.use(helmet({
    contentSecurityPolicy: false
}));


// add the passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratey(User.authenticate()));

// stored it and unstore it in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// add the middleware of flash
// then add the flash success in post route of campground
// then declare it in boilerplate
app.use(flash());
app.use((req,res,next) => {
    //console.log(req.session);
    console.log(req.query);
    res.locals.currentUser = req.user; // this for checking the user info
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



// create the fake user with email
app.get('/fakeUser', async(req,res) => {
    const user = new User({
        email:'abdu@gmail.com',
        username: 'Abdullah'
    });
    // from local passport will do the register
    // then add the user then password
    const newUser = await User.register(user,'1234');
    res.send(newUser);
    // it will create the salt,hash from local passport
});




app.get('/', (req,res) => {
    //res.send('Hello')
    res.render('campgrounds/home')
});

// i made the folder routes
// then i put all campgrounds routes inside the campgrounds.js
// i need to require campgrounds.js

app.use('/campgrounds',campgroundRoutes);


// i made the folder routes
// then i put all reivews routes inside the reviews.js
// i need to require reviews.js

app.use('/campgrounds/:id/reviews',reviewRoutes);


// i need to require users.js
app.use('/',usersRoutes);

// this is will implement if route wrong
// * means all routes
app.all('*',(req,res,next) => {
    //res.send('404!!')
    next(new ExpressError('Page Not Found',404))
});

// write the erro handle
app.use((err,req,res,next) => {
    const {statusCode = 500,message = 'Someting Went Wrong'} = err;
    //res.status(statusCode).send(message);
    if(!err.message) err.message = 'Oh No, Someting Went Wrong';
    res.status(statusCode).render('error', {err});
    //res.send('Oh boy, Someting went wrong');
});

const port = process.env.PORT || 3000; 
app.listen(port, () =>{
    console.log(`Serving on port ${port}`)
});

/*
app.get('/makecampground', async (req,res) => {
    const camp = new Campground({
        title: 'My Background',
        description: 'cheap camping'
    })
    await camp.save();
    res.send(camp)
});

13.228.225.19
18.142.128.26
54.254.162.138

newWebServer
*/


