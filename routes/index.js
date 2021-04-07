const router = require("express").Router();

router.use("/", [
  require("./iframe-video"),
  require("./hentai"),
  require("./index/index"),
  require("./pre-search"),
  require("./search"),
  require("./setup"),
  require("./sitemap"),
  require("./_type")
]);

module.exports = router;
