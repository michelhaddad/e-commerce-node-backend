const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Token = require('../models/token');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: 'Your email is required',
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      required: false,
      index: true,
      sparse: true,
    },

    password: {
      type: String,
      required: 'Your password is required',
      max: 100,
    },

    firstName: {
      type: String,
      required: 'First Name is required',
      max: 100,
    },

    lastName: {
      type: String,
      required: 'Last Name is required',
      max: 100,
    },

    phoneNumber: {
      type: String,
      required: false,
      max: 20,
    },

    bio: {
      type: String,
      required: false,
      max: 255,
    },

    roles: {
      type: [
        {
          type: String,
          enum: ['user', 'admin'],
        },
      ],
      default: ['user'],
    },

    profileUrl: {
      type: String,
      required: false,
      max: 255,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpires: {
      type: Date,
      required: false,
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  let payload = {
    id: this._id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

UserSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString('hex'),
  };

  return new Token(payload);
};

module.exports = mongoose.model('Users', UserSchema);
