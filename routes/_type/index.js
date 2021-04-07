const { getHentaizOnCategory } = require("../../helpers");
const router = require("express").Router();

router
  .route("/:type/:id")
  .get(async ({ params: { type, id }, query: { page = 1, sort } }, res) => {
    try {
      res.json(
        await getHentaizOnCategory(
          `${process.env.CAWRL_URL}/${type === "special" ? "" : type}`,
          id,
          page,
          sort
        )
      );
    } catch (e) {
      res.status(404).end(`Error: ${404}`);
    }
  });

module.exports = router;
