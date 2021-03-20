const Products = require('../models/products');
const fs = require('fs');
const path = require('path');
const productImageUrl = 'https://serene-brushlands-68192.herokuapp.com/images/';

const indexProducts = (req, res, next) => {
  Products.find({}).then((products) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(products);
  }, (err) => next(err)).catch((err) => next(err));
};

const createProduct = (req, res, next) => {
  Products.create(req.body).then((product) => {
    console.log('Product Created ', product);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(product);
  }, (err) => next(err)).catch((err) => next(err));
};

const getProductById = (req, res, next) => {
  Products.findById(req.params.id).
      then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
      }, (err) => next(err)).
      catch((err) => next(err));
};

const updateProduct = (req, res, next) => {
  Products.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).
      then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
      }, (err) => next(err)).catch((err) => next(err));
}

const deleteProduct = (req, res, next) => {
  Products.findByIdAndRemove(req.params.id).then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err)).catch((err) => next(err));
}

const addProductImage = (req, res, next) => {
  Products.findByIdAndUpdate(req.params.id, {$set: {imageUrl: productImageUrl + req.params.id + '.png'}}, {new: true}).
      then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Successfully uploaded image.'});
      }, (err) => next(err)).catch((err) => next(err));
}

const updateProductImage = (req, res, next) => {

  Products.findByIdAndUpdate(req.params.id, {$set: {imageUrl: productImageUrl + req.params.id + '.png'}}, {new: true}).
      then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Successfully uploaded image.'});
      }, (err) => next(err)).catch((err) => next(err));
}

module.exports = {
  indexProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImage,
  updateProductImage
};
