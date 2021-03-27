const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');

const bodyParser = require('body-parser');

const usersActions = require('../controllers/usersController');

router.use(bodyParser.json());

router.get(
  '/:id',
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  usersActions.getUserById,
);

router.post('/signup', usersActions.signup);

router.post('/login', passport.authenticate('local'), usersActions.login);

module.exports = router;
