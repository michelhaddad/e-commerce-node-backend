const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const authenticate = require('../middlewares/authenticate');

const orderActions = require('../controllers/orderController');
const orderRouter = express.Router();

orderRouter.use(bodyParser.json());

orderRouter
  .route('/')
  .get(authenticate, orderActions.indexUserOrders)
  .post(authenticate, orderActions.createOrder);
// .put((req, res, next) => {
//   res.statusCode = 403;
//   res.end('PUT operation not supported on /products');
// });

// orderRouter
//   .route('/:id')
//   .get(orderActions.getProductById)
//   .put(authenticate, orderActions.updateProduct)
//   .delete(authenticate, orderActions.deleteProduct)
//   .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /products/' + req.params.id);
//   });
//
// orderRouter
//   .route('/image/:id')
//   .post(
//     multer({ dest: 'tmp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
//       'image',
//     ),
//     authenticate,
//     orderActions.addProductImage,
//   )
//   .put(
//     multer({ dest: 'tmp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
//       'image',
//     ),
//     authenticate,
//     orderActions.addProductImage,
//   );

module.exports = orderRouter;
