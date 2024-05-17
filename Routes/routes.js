const express = require("express")
const router = express.Router();
const fileOperations = require("../Modules/file");

router.post("/upload",fileOperations.fileUpload);
router.get("/list",fileOperations.listFiles)

module.exports = router;
