const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = model('user', userSchema);
