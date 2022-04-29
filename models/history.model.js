const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const historySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

historySchema.plugin(toJSON);

const History = mongoose.model('History', historySchema);

module.exports = History;
