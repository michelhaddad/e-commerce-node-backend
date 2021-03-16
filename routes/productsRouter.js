const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Products = require('../models/products');

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route('/').
    get((req, res, next) => {
      Products.find({})
          .then((products) => {
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

module.exports = productRouter;
