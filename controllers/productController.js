const Products = require('../models/products');
const aws = require('../utils/aws');
const fs = require('fs');

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
};

const deleteProduct = (req, res, next) => {
  Products.findByIdAndRemove(req.params.id).then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err)).catch((err) => next(err));
};

const addProductImage = (req, res, next) => {
  Products.findById(req.params.id).
      then((product) => {
        if (!product) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.json({status: 'Product not found.'});
          return;
        }
        const s3 = new aws.S3();
        const params = {
          ACL: 'public-read',
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: fs.createReadStream(req.file.path),
          Key: `products/images/${req.params.id + req.file.originalname}`,
          ContentType: req.file.mimetype,
        };

        s3.upload(params, (err, data) => {
          if (err) {
            throw err;
          }
          if (data) {
            fs.unlinkSync(req.file.path);
            product.imageUrl = data.Location;
            product.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: 'Successfully uploaded image.'});
          } else {
            throw new Error('Image could not be saved to the S3 bucket.');
          }
        });
      }, (err) => next(err)).catch((err) => next(err));
};

module.exports = {
  indexProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImage,
};
