const Products = require('../models/products');
const ProductImages = require('../models/productImages');
const fs = require('fs');
const path = require('path');
const productImageUrl = 'https://serene-brushlands-68192.herokuapp.com/products/image/';

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

const getProductImage = (req, res, next) => {
  ProductImages.findById(req.params.id).
      then((productImage) => {
        if (!productImage) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.json({status: 'Product has no image.'});
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'image/png');
          res.send(productImage.img.data);
        }
      }, (err) => next(err)).
      catch((err) => next(err));
}

const addProductImage = (req, res, next) => {
  const obj = {
    data: fs.readFileSync(
        path.join(__dirname + '/../uploads/' + req.file.filename)),
    contentType: 'image/png',
  };
  const productImage = new ProductImages();
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
}

const updateProductImage = (req, res, next) => {
  const obj = {
    data: fs.readFileSync(
        path.join(__dirname + '/../uploads/' + req.file.filename)),
    contentType: 'image/png',
  };
  ProductImages.findByIdAndUpdate(req.params.id, {$set: {img: obj}},
      {new: true}).
      then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Successfully modified image.'});
      }, (err) => next(err)).catch((err) => next(err));
}

module.exports = {
  indexProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductImage,
  addProductImage
};
