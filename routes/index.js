const express = require('express')
const router = express.Router();
const homeController = require('../controllers/home_controllers');
const userController = require('../controllers/users_controller');

router.get('/', homeController.home);

router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'))

router.use("/api", require('./api'));

//for any other routes access from here
//router.use(/routename,reuire('./routerfile'))
console.log("router file is loaded");
module.exports = router;