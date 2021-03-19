const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const productImageUrl = 'https://serene-brushlands-68192.herokuapp.com/products/image/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({storage: storage});

const Products = require('../models/products');
const ProductsImages = require('../models/productImages');

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route('/').
    get((req, res, next) => {
      Products.find({}).then((products) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
      }, (err) => next(err)).catch((err) => next(err));
    }).
    post(authenticate.verifyUser, authenticate.verifyAdmin,
        (req, res, next) => {
          Products.create(req.body).then((product) => {
            console.log('Product Created ', product);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product);
          }, (err) => next(err)).catch((err) => next(err));
        }).
    put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /products');
    });

productRouter.route('/:id').
    get((req, res, next) => {
      Products.findById(req.params.id).
          then((product) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product);
          }, (err) => next(err)).
          catch((err) => next(err));
    }).
    post(authenticate.verifyUser, authenticate.verifyAdmin,
        (req, res, next) => {
          res.statusCode = 403;
          res.end(
              'POST operation not supported on /products/' + req.params.id);
        }).
    put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Products.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).
          then((product) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product);
          }, (err) => next(err)).catch((err) => next(err));
    }).
    delete(authenticate.verifyUser, authenticate.verifyAdmin,
        (req, res, next) => {
          Products.findByIdAndRemove(req.params.id).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
          }, (err) => next(err)).catch((err) => next(err));
        });

productRouter.route('/image/:id').
    get((req, res, next) => {
      ProductsImages.findById(req.params.id).
          then((productImage) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/*');
            res.send(productImage.img.data);
          }, (err) => next(err)).
          catch((err) => next(err));
    }).
    post(upload.single('image'), authenticate.verifyUser,
        authenticate.verifyAdmin, (req, res, next) => {
          const obj = {
            data: fs.readFileSync(
                path.join(__dirname + '/../uploads/' + req.file.filename)),
            contentType: 'image/png',
          };
          const productImage = new ProductsImages();
          productImage._id = req.params.id;
          productImage.img = obj;
          productImage.save().then(() => {
            Products.findByIdAndUpdate(req.params.id, {$set: {imageUrl: productImageUrl + req.params.id}}, {new: true}).
                then((product) => {
                  console.log('Product image added ', product);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({status: 'Successfully uploaded image.'});
                });
          }, (err) => next(err)).catch((err) => next(err));
        }).
    put(upload.single('image'), authenticate.verifyUser,
        authenticate.verifyAdmin, (req, res, next) => {
          const obj = {
            data: fs.readFileSync(
                path.join(__dirname + '/../uploads/' + req.file.filename)),
            contentType: 'image/png',
          };
          ProductsImages.findByIdAndUpdate(req.params.id, {$set: {img: obj}},
              {new: true}).
              then((product) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Successfully modified image.'});
              }, (err) => next(err)).catch((err) => next(err));
        });

module.exports = productRouter;
