const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + '.png');
  },
});

const upload = multer({storage: storage});

module.exports = upload;
