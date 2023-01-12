
const { siteSchema } = require('./schemas.js');
const { productSchema } = require('./schemas.js');
const { commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Site = require('./models/site');
const Product = require('./models/product');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateSite = (req, res, next) => {
    const { error } = siteSchema.validate(req.body.site);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body.product);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isSiteAuthor = async (req, res, next) => {
    const { id } = req.params;
    const site = await Site.findById(id);
    if (site.author.equals(req.user._id) || req.user.isAdmin) {
        next();
    } else {
        req.flash('error', 'You do not have permission to do that to the site');
        return res.redirect('/sites');
    }
}

module.exports.isProductAuthor = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product.author.equals(req.user._id) || req.user.isAdmin) {
        next();
    } else {
        req.flash('error', 'You do not have permission to do that to the product stock report');
        return res.redirect('/sites');
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (comment.author.equals(req.user._id) || req.user.isAdmin) {
        next();
    } else {
        req.flash('error', 'You do not have permission to do that to the comment');
        res.redirect(`/products/${id}`);
    }
}