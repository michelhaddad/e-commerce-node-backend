const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../middlewares/authenticate');

const productCollectionController = require('../controllers/productCollectionController');
const productCollectionRouter = express.Router();

productCollectionRouter.use(bodyParser.json());

productCollectionRouter
  .route('/')
  .get(productCollectionController.indexCollections)
  .post(authenticate, productCollectionController.addCollection);

module.exports = productCollectionRouter;
