const axios = require("../../cache-axios");
const { createDOM, toResolvePath } = require("../../utils");

exports.get = async ({ query: { query = "" } }, res) => {
  if (!query) {
    res.json({
      hentais: [],
    });
  } else {
    const { data } = await axios.get(
      encodeURI(`${process.env.CAWRL_URL}/wp-admin/admin-ajax.php`),
      {
        params: {
          action: "hx_ac",
          data: query || "",
        },
      }
    );

    const document = await createDOM(data, true);

    res.json({
      hentais: Array.from(document.querySelectorAll("a")).map((item) => {
        return {
          href: "/hentai" + toResolvePath(item.getAttribute("href")),
          text: item.querySelector(".name").textContent,
        };
      }),
    });
  }
};
