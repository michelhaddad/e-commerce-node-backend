const ProductCollection = require('../models/productCollections');

exports.indexCollections = async (req, res, next) => {
  try {
    const collections = await ProductCollection.find().populate('items');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(collections);
  } catch (e) {
    next(e);
  }
};

exports.addCollection = async (req, res, next) => {
  try {
    const { items, name } = req.body;
    let collection = await ProductCollection.findOne({ name: name });
    if (collection) {
      return res
        .status(400)
        .json({ message: 'Collection with same name already exists.' });
    }

    collection = await ProductCollection.create({
      items,
      name,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(collection);
  } catch (e) {
    next(e);
  }
};
