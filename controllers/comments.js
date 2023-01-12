const Product = require('../models/product');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const product = await Product.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    product.comments.push(comment);
    await comment.save();
    await product.save();
    req.flash('success', 'Succesfully added new comment');
    res.redirect(`/products/${product._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Succesfully deleted that comment');
    res.redirect(`/products/${id}`);
}