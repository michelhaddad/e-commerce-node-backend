const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');

const bodyParser = require('body-parser');

const usersActions = require('../controllers/usersController');

router.use(bodyParser.json());

router.get('/',authenticate.verifyUser, authenticate.verifyAdmin, usersActions.findUser);

router.post('/signup', usersActions.signUp);

router.post('/login', passport.authenticate('local'), usersActions.logIn);

module.exports = router;
