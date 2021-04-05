const { getHentaizOnCategory } = require("../../helpers");
const router = require("express").Router();

router
  .route("/nam-sx/:id")
  .get(async ({ params: { id }, query: { page = 1, sort } }, res) => {
    try {
      res.json(
        await getHentaizOnCategory(
          `${process.env.CAWRL_URL}/nam-sx`,
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
