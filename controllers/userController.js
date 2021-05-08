const User = require('../models/user');
const fs = require('fs');
const aws = require('../utils/aws');
const { sendEmail } = require('../utils/sendGrid');
const { allowedFields } = require('../utils/constants');

// @route GET admin/user
// @desc Returns all users
// @access Public
exports.index = async function (req, res) {
  const users = await User.find({});
  res.status(200).json({ users });
};

// @route POST api/user
// @desc Add a new user
// @access Public
exports.store = async (req, res) => {
  try {
    const { email } = req.body;

    // Make sure this account doesn't already exist
    const user = await User.findOne({ email });

    if (user)
      return res.status(401).json({
        message:
          'The email address you have entered is already associated with another account. You can change this users role instead.',
      });

    const password = '_' + Math.random().toString(36).substr(2, 9); //generate a random password
    const newUser = new User({ ...req.body, password });

    const user_ = await newUser.save();

    //Generate and set password reset token
    user_.generatePasswordReset();

    // Save the updated user object
    await user_.save();

    //Get mail options
    let domain = 'http://' + req.headers.host;
    let subject = 'New Account Created';
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let link =
      'http://' +
      req.headers.host +
      '/api/auth/reset/' +
      user.resetPasswordToken;
    let html = `<p>Hi ${user.username}<p><br><p>A new account has been created for you on ${domain}. Please click on the following <a href="${link}">link</a> to set your password and login.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

    await sendEmail({ to, from, subject, html });

    res
      .status(200)
      .json({ message: 'An email has been sent to ' + user.email + '.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show = async function (req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User does not exist' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT api/user/info
// @desc Update user details
// @access Public

exports.updateInfo = async function (req, res) {
  try {
    const updateInfo = req.body;
    const userId = req.user._id;

    if (Object.keys(updateInfo).length === 0) {
      return res
        .status(406)
        .json({ message: 'No updated fields were provided' });
    }

    const allowedInfo = Object.keys(updateInfo)
      .filter((field) => allowedFields.includes(field))
      .reduce((obj, key) => {
        obj[key] = updateInfo[key];
        return obj;
      }, {});

    if (Object.keys(allowedInfo).length === 0) {
      return res.status(403).json({
        message: "You don't have the right to update these fields",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: allowedInfo },
      { new: true },
    );

    res.status(200).json({ user, message: 'User has been updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT api/user/image
// @desc Update user details
// @access Public
exports.updateProfileImage = async function (req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const s3 = new aws.S3();
    const params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fs.createReadStream(req.file.path),
      Key: `users/images/profile/${req.user._id + req.file.originalname}`,
      ContentType: req.file.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        throw err;
      }
      if (data) {
        fs.unlinkSync(req.file.path);
        user.profileUrl = data.Location;
        user.save();
        res
          .status(200)
          .json({ user, message: 'Profile picture successfully updated' });
      } else {
        throw new Error('Image could not be saved to the S3 bucket.');
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DESTROY api/user/{id}
// @desc Delete User
// @access Public
exports.destroy = async function (req, res) {
  try {
    const id = req.params.id;
    const user_id = req.user._id;

    //Make sure the passed id is that of the logged in user
    if (user_id.toString() !== id.toString())
      return res.status(401).json({
        message: "Sorry, you don't have the permission to delete this data.",
      });

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
