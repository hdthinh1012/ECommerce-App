const mongoose = require("mongoose");

const { Schema } = mongoose;
const FunitureSchema = new Schema({
    name: String,
    categoryId: String,
    price: Number,
    imageUrl: String,
});

const Funiture = mongoose.model('Funiture', FunitureSchema);

module.exports = Funiture;