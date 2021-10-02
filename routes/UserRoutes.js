const express = require('express');
const userController =require('./../controllers/UserController');
const authController =require('./../controllers/AuthController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);  

module.exports = router;