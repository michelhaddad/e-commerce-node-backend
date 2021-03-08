const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Products = require('../models/products');

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route('/')
    .get((req,res,next) => {
        Products.find({})
            // Populate is used here to implement a foreign key-like mechanism (Mongoose population)
            // see https://mongoosejs.com/docs/populate.html
            .then((products) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(products);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Products.create(req.body)
            .then((product) => {
                console.log('Product Created ', product);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })


module.exports = productRouter;
