const mongoose = require('mongoose')

const task = new mongoose.Schema(
  {
    todo: [{ type: String }],
    done: [{ type: String }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Task', task)