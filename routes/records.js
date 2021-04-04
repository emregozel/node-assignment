const express = require("express");

const RecordsController = require("../controllers/records");

const router = express.Router();

router.post('/', RecordsController.getRecords);

module.exports = router;