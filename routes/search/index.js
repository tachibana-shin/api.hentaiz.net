const router = require("express").Router();
const axios = require("../../cache-axios");
const { getItemOnBlocks } = require("../../helpers");
const { createDOM, toResolvePath } = require("../../utils");

router
  .route("/search")
  .get(
    async (
      { query: { query, producer, year, type, categories, page } },
      res
    ) => {
      const { data } = await axios.get(`${process.env.CAWRL_URL}`, {
        params: {
          s: query,
          hxproducer: producer,
          hxyear: year,
          hxtype: type,
          hxgenres: categories,
          page: page || 1,
        },
      });

      const document = await createDOM(data, true);

      res.json({
        hentais: getItemOnBlocks(document),
      });
    }
  );

module.exports = router;
