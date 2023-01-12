
const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync')
const Product = require('../models/product');
const Comment = require('../models/comment');


router.post('/', validateComment, isLoggedIn, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;