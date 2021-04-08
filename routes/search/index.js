const router = require("express").Router();
const axios = require("../../cache-axios");
const { getItemOnBlocks, getMaxPage } = require("../../helpers");
const { createDOM, toResolvePath } = require("../../utils");

router
  .route("/search")
  .get(
    async (
      { query: { query, producer, year, type, categories, page = 1 } },
      res
    ) => {
      const { data } = await axios.get(
        encodeURI(`${process.env.CAWRL_URL}/page/${page}`),
        {
          params: {
            s: query,
            hxproducer: producer,
            hxyear: year,
            hxtype: type,
            hxgenres: categories,
          },
        }
      );

      const document = await createDOM(data, true);

      res.json({
        hentais: getItemOnBlocks(document),
        maxPage: getMaxPage(document, `${process.env.CAWRL_URL}/page/${page}`),
      });
    }
  );

module.exports = router;
