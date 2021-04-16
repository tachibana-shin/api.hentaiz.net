const { getItemOnBlocks, getItemOnCarousel } = require("../../helpers");
const { createDOM } = require("../../utils");

exports.get = async (req, res) => {
  const [home, noCover, finish] = await Promise.all([
    createDOM(`${process.env.CAWRL_URL}`),
    createDOM(`${process.env.CAWRL_URL}/hentai-uncensored`),
    createDOM(`${process.env.CAWRL_URL}/completed-hentai`),
  ]);

  const hentaiNew = getItemOnBlocks(home);
  const hentaiTopWeek = getItemOnCarousel(
    home.querySelectorAll(".owl-carousel:nth-child(1) .item")
  );
  const hentaiCommingSoon = getItemOnCarousel(
    home.querySelectorAll("#owl-trailer .item")
  );
  const hentaiNoCover = getItemOnBlocks(noCover);
  const hentaiFinish = getItemOnBlocks(finish);

  res.json({
    hentaiNew,
    hentaiTopWeek,
    hentaiCommingSoon,
    hentaiNoCover,
    hentaiFinish,
  });
};
