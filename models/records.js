const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const recordSchema = mongoose.Schema({
    key: { type: String, require: true },
    createdAt: { type: Date, require: true },
    counts: { type: Array, require: true },
    value: { type: String, require: true}
});

recordSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Records', recordSchema);