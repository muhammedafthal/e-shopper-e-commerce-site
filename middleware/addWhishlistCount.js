const Wishlist = require('../models/whishlist');

async function addWishlistCount(req, res, next) {
    if (req.userId) {
        const wishlist = await Wishlist.findOne({ userId: req.userId });
        res.locals.wishlistCount = wishlist ? wishlist.product.length : 0;
    } else {
        res.locals.wishlistCount = 0;
    }
    next();
}

module.exports = addWishlistCount;
