const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const { cat } = req.query;
    if (cat) {
        const products = await Product.find({ cat }).populate('site');
        res.render('products/index', { products, cat });
    } else {
        const products = await Product.find({}).populate('site');
        res.render('products/index', { products, cat: 'All' })
    }
}

module.exports.showProduct = async (req, res) => {
    const { id } = req.params;
    const product = await (await Product.findById(req.params.id).populate('site').populate('author').
        populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        }
        ));
    if (!product) {
        req.flash('error', 'Stock report does not exist (anymore), try again');
        return res.redirect('/products');
    }
    res.render('products/show', { product })
}



module.exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('author');
    if (!product) {
        req.flash('error', 'Stock report does not exist (anymore), try again');
        return res.redirect('/products');
    }
    res.render('products/edit', { product })
}


module.exports.putProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await product.save()
    req.flash('success', 'Succesfully updated stock report');
    res.redirect(`/products/${product._id}`)
}


module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    req.flash('success', 'Stock report (and comments) succesfully deleted');
    res.redirect('/products');
}