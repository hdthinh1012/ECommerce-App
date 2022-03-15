const mongoose = require("mongoose");

const { Schema } = mongoose;

const UnitAmountSchema = new Schema({
    currency_code: String,
    value: String,
}, { _id: false });

const CartItemSchema = new Schema({
    sku: String,
    name: String,
    unit_amount: UnitAmountSchema,
    quantity: String,
}, { _id: false });

const hateoasLinkSchema = new Schema({
    href: String,
    rel: String,
    method: String,
}, { _id: false });

const OrderSchema = new Schema({
    _id: String,
    user_id: String,
    status: String,
    total_amount: UnitAmountSchema,
    items: [CartItemSchema],
    hateoas_links: [hateoasLinkSchema],
}, { _id: false })

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;