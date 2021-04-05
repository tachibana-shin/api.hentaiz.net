const router = require("express").Router();

router.use("/", [
  require("./iframe-video"),
  require("./hentai"),
  require("./category"),
  require("./special"),
  require("./nam-sx"),
  require("./index/index"),
  require("./pre-search"),
  require("./search"),
  require("./setup")
]);

module.exports = router;
