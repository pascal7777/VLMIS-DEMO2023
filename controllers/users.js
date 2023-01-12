const User = require('../models/user');




module.exports.registrationForm = (req, res) => {
    res.render('users/register');
}


module.exports.createRegistration = async (req, res, next) => {
    try {
        const { email, username, site_name, job_position, affiliation, password } = req.body;
        const user = new User({ email, username, site_name, job_position, affiliation });
        if (req.body.adminCode === 'secret') {
            user.isAdmin = true;
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to VLMIS!');
            res.redirect('/sites');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.makeLogin = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/sites';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}