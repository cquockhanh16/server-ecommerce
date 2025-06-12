const express = require("express");
const router = express.Router();

const CollectionController = require("../controllers/collection-controller");

router.post("/collection/create", CollectionController.createCollection);

// router.post("/Collection/list", CollectionController.Brand);

module.exports = router;
