const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.post('/create-order', OrderController.createOrder);

router.post('/capture-order', OrderController.captureOrder);

router.post('/get-access-token', OrderController.getAccessToken);

module.exports = router;