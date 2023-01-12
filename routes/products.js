const express = require('express');
const router = express.Router();
const products = require('../controllers/products');
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isProductAuthor, validateProduct } = require('../middleware');
const Product = require('../models/product');

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.get('/', catchAsync(products.index))

router.get('/:id', isLoggedIn, catchAsync(products.showProduct))

router.get('/:id/edit', isProductAuthor, catchAsync(products.editProduct))

router.put('/:id', isLoggedIn, isProductAuthor, validateProduct, upload.array('image'), catchAsync(products.putProduct))

router.delete('/:id', isLoggedIn, isProductAuthor, catchAsync(products.deleteProduct))



module.exports = router;