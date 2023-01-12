const Site = require('../models/site');
const Product = require('../models/product');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const sites = await Site.find({});
    res.render('sites/index', { sites })
}


module.exports.renderNewForm = (req, res) => {
    res.render('sites/new')
}

module.exports.createSite = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.site_district,
        limit: 1
    }).send()
    const site = new Site(req.body);
    site.geometry = geoData.body.features[0].geometry;
    site.author = req.user._id;
    await site.save();
    console.log(site);
    req.flash('success', 'Succesfully added new site');
    res.redirect(`/sites/${site._id}`)
}

module.exports.showSite = async (req, res) => {
    const { id } = req.params;
    const site = await Site.findById(req.params.id).populate('products').populate('author');
    if (!site) {
        req.flash('error', 'Site does not exist (anymore), try again');
        return res.redirect('/sites');
    }
    res.render('sites/show', { site })
}

module.exports.editSite = async (req, res) => {
    const { id } = req.params;
    const site = await Site.findById(id);
    if (!site) {
        req.flash('error', 'Site does not exist (anymore), try again');
        return res.redirect('/sites');
    }
    res.render('sites/edit', { site })
}


module.exports.putEditSite = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.site_district,
        limit: 1
    }).send()
    const site = await Site.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    site.geometry = geoData.body.features[0].geometry;
    await site.save();
    req.flash('success', 'Succesfully updated site details');
    res.redirect(`/sites/${site._id}`)
}


module.exports.renderNewProductForm = async (req, res) => {
    const { id } = req.params;
    const site = await Site.findById(id);
    res.render('products/new', { site })
}

module.exports.createNewProduct = async (req, res) => {

    const { id } = req.params;
    const site = await Site.findById(id);
    const product = new Product(req.body);
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    site.products.push(product);
    product.site = site;
    product.author = req.user._id;
    await site.save();
    await product.save();
    console.log(product);
    req.flash('success', 'Succesfully added new stock report');
    res.redirect(`/sites/${id}`)
}

module.exports.deleteSite = async (req, res) => {
    const site = await Site.findByIdAndDelete(req.params.id);
    req.flash('success', 'Site (and associated products) succesfully deleted');
    res.redirect('/sites');
}