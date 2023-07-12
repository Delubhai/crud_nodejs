const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

//User Schema
const todoSchema = mongoose.Schema({
  'vTitle': {
    type: String,
    // required: [true, 'Required'],
  },
  'vDescription': {
    type: String,
    // required: [true, 'Required'],
  },
  'oUserId': {
    type: ObjectId,
    ref: "User",
    default: null
  },
  'bIsDeleted': {
    type: Boolean,
    default: false
  },
  'bMarkCompleted': {
    type: Boolean,
    default: false
  },
  'iDueDate': {
    type: Number,
    required: [true, 'Required'],
  },
  'iCreatedAt': {
    type: Number,
    required: [true, 'Required'],
  },
  'iUpdatedAt': {
    type: Number,
    default: null
  }
});

let Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
