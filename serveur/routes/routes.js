const express = require("express");

const locationController = require('../controllers/location.js')
const categoryController = require('../controllers/category.js')
const userController = require('../controllers/user.js');
const adController = require('../controllers/ad.js')

const profileController = require('../controllers/profile.js');
const adminController = require('../controllers/admin.js');

// Middleware for block access 
function isAuthenticated(req, res, next) {
    if (req.session && req.session.connected) {
        return next(); 
    } else {
        return res.status(401).send('401 Unauthorized'); 
    }
}

// Middleware for block access to admin pages
function isAdmin(req, res, next) {
    if (req.session && req.session.connected && req.session.user && req.session.user.admin) {
        return next(); 
    } else {
        return res.status(401).send('401 Unauthorized'); 
    }
}
const router = express.Router();


/** Admin roads* **/
router.get('/api/admin',isAuthenticated, isAdmin, adminController.getAllAds);
router.post('/api/admin/ad/:id',isAuthenticated, isAdmin,  adminController.adminUpdatePost);
router.get('/api/admin/delete/ad/:id',isAuthenticated, isAdmin,  adminController.adminDeleteUserAd);
router.get('/api/admin/comments',isAuthenticated, isAdmin,  adminController.getAllComments);
router.get('/api/admin/delete/comment/:id',isAuthenticated, isAdmin,  adminController.adminDeleteComment);




router.post('/api/register', userController.register)
router.post('/api/login', userController.loginLimiter, userController.login)
router.get('/api/logout', userController.logout)
router.get('/api/confirm/:confirmationCodeHash', userController.confirmAccount);

router.get('/api/category', categoryController.list)
router.get('/api/category/:id', categoryController.listWithAd)


router.get('/api/location/:location_id/categories', locationController.getCategoriesByLocation);


router.get('/api/ad', adController.editAd); 
router.get('/api/ad/:id',isAuthenticated, adController.editPost); 
router.get('/api/ad/search/:keyword', adController.searchAdsByKeyword);


router.get('/api/user/ad',isAuthenticated, adController.getUserAds);
router.get('/api/user',  adController.getUserId);
router.get('/api/getOwnerByAdId/:id', adController.getOwnerByAdId);
router.post('/api/user/ad/:id',isAuthenticated, adController.updatePost);
router.delete('/api/user/delete/image/:id',isAuthenticated, adController.deleteUserImage);
router.get('/api/user/delete/ad/:id',isAuthenticated, adController.deleteUserAd); 
router.post('/api/account/create',isAuthenticated, adController.createPost); 


// User Profile
router.get('/api/profile/:id',profileController.getUserProfile);
router.post('/api/profile',isAuthenticated, profileController.updateUserProfile);

// User Ratings
router.get('/api/ratings/:id',profileController.getProfileRatings);
router.post('/api/ratings/:id',isAuthenticated, profileController.addRating);

module.exports.router = router;
