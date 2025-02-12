const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema(
    {
        title: {type: String, required: true},
        commentcount: {type: Number, default: 0},
        comments: Array
    },
    { versionKey: false }
);

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;
