const { Schema, model, Types } = require('mongoose');

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Types.ObjectId,
    required: true,
  },
  likes: {
    type: [Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('card', cardSchema);
