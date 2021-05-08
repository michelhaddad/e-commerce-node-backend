const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');

const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');

const router = express.Router();

// const upload = multer().single('profileImage');

//INDEX
router.get('/', userController.index);

//STORE
router.post(
  '/',
  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('username').not().isEmpty().withMessage('You username is required'),
    check('firstName')
      .not()
      .isEmpty()
      .withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required'),
  ],
  validate,
  userController.store,
);

//SHOW
router.get('/:id', userController.show);

//UPDATE
router.put('/info', userController.updateInfo);
// router.put('/image', upload, User.image);

//DELETE
router.delete('/:id', userController.destroy);

router.put(
  '/profile',
  multer({ dest: 'tmp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
    'image',
  ),
  userController.updateProfileImage,
);

module.exports = router;
