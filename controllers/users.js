const User = require('../models/user');

module.exports.registerRenderPage = (req,res) => {
    res.render('users/register')
}

module.exports.registerUser = async(req,res) => {
    //res.send(req.body)
    try{
        const {email,username,password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user,password);
        console.log(registeredUser);
        // need to login the user after succeessfully add the user
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginRenderPage = (req,res) => {
    res.render('users/login');
}

module.exports.userLogIn = (req,res) => {
    req.flash('success','Welcome Back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.userLogOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}