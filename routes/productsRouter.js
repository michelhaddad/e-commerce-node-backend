const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const upload = require('../utils/multer-config');

const productActions = require('../controllers/productController');
const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route('/').
    get(productActions.indexProducts).
    post(authenticate.verifyUser, authenticate.verifyAdmin, productActions.createProduct).
    put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /products');
    });

productRouter.route('/:id').
    get(productActions.getProductById).
    put(authenticate.verifyUser, authenticate.verifyAdmin, productActions.updateProduct).
    delete(authenticate.verifyUser, authenticate.verifyAdmin, productActions.deleteProduct).
    post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403;
      res.end(
          'POST operation not supported on /products/' + req.params.id);
    })

productRouter.route('/image/:id').
    post(upload.single('image'), authenticate.verifyUser, authenticate.verifyAdmin, productActions.addProductImage).
    put(upload.single('image'), authenticate.verifyUser, authenticate.verifyAdmin, productActions.updateProductImage);

module.exports = productRouter;
