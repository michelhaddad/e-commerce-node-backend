const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const authenticate = require('../middlewares/authenticate');

const productActions = require('../controllers/productController');
const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter
  .route('/')
  .get(productActions.indexProducts)
  .post(authenticate, productActions.createProduct)
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /products');
  });

productRouter
  .route('/:id')
  .get(productActions.getProductById)
  .put(authenticate, productActions.updateProduct)
  .delete(authenticate, productActions.deleteProduct)
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /products/' + req.params.id);
  });

productRouter
  .route('/image/:id')
  .post(
    multer({ dest: 'tmp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
      'image',
    ),
    authenticate,
    productActions.addProductImage,
  )
  .put(
    multer({ dest: 'tmp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
      'image',
    ),
    authenticate,
    productActions.addProductImage,
  );

module.exports = productRouter;
