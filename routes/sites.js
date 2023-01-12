const express = require('express');
const router = express.Router();
const sites = require('../controllers/sites');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isSiteAuthor, validateSite, validateProduct } = require('../middleware');
const Site = require('../models/site');
const Product = require('../models/product');

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


// router.route('/')
//     .get(catchAsync(sites.index))
//     .post(isLoggedIn, validateSite, catchAsync(sites.createSite))

router.get('/', catchAsync(sites.index))

router.get('/new', isLoggedIn, sites.renderNewForm)

router.post('/', isLoggedIn, validateSite, catchAsync(sites.createSite))


// router.route('/:id')
//     .get(catchAsync(sites.showSite))
//     .delete(isAuthor, catchAsync(sites.deleteSite))

router.get('/:id/edit', isSiteAuthor, catchAsync(sites.editSite))

router.put('/:id', isLoggedIn, isSiteAuthor, validateSite, catchAsync(sites.putEditSite))

router.get('/:id', catchAsync(sites.showSite))

router.delete('/:id', isSiteAuthor, catchAsync(sites.deleteSite))

router.get('/:id/products/new', isLoggedIn, isSiteAuthor, sites.renderNewProductForm)

router.post('/:id/products', isLoggedIn, isSiteAuthor, validateProduct, upload.array('image'), catchAsync(sites.createNewProduct))
// router.post('/:id/products', upload.array('image'), function (req, res) {
//     console.log(req.files, req.body)
//     res.send("It worked?!")
// });


module.exports = router;