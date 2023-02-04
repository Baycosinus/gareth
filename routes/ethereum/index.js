const express = require('express');
const router = express.Router();

const ethereumController = require("../../controllers/ethereum/ethereumController");

router.post('/ethereum', ethereumController.processEthereumAddresses);


module.exports = router;