const axios = require("../cache-axios");
const { JSDOM } = require("jsdom");
const {
  create$,
  toResolvePath,
  createDOM,
  separationCaption,
} = require("../utils");

exports.getSrcForIframeVideo = async ({ url, x = "" }) => {
  const { data } = await axios.get(
    `${process.env.CAWRL_URL}/wp-admin/admin-ajax.php`,
    {
      params: {
        action: "hx_gl",
        url,
        x,
      },
    }
  );
  const {
    window: { document },
  } = new JSDOM(data);

  if (document.querySelectorAll("iframe").length === 0) {
    /// server IG
    return `${process.env.BASE_URL}/iframe-video?url=${url}&x=${x}`;
  } else {
    return document.querySelector("iframe").getAttribute("src");
  }
};

exports.getItemOnCarousel = (items) => {
  return Array.from(items).map((item) => {
    const { title, subtitle } = separationCaption(
      item.querySelector(".caption")
    );

    return {
      href:
        "/hentai" + toResolvePath(item.querySelector("a").getAttribute("href")),
      image: item.querySelector("img").getAttribute("src"),
      title,
      subtitle,
    };
  });
};

exports.getItemOnBlocks = (document) => {
  return Array.from(document.querySelectorAll(".block")).map((block) => {
    const { title, subtitle } = separationCaption(
      block.querySelector(".caption")
    );

    return {
      pratical: block.querySelector(".jcarousel-set").textContent,
      href:
        "/hentai" +
        toResolvePath(block.querySelector("a").getAttribute("href")),
      image: block.querySelector("img").getAttribute("src"),
      title,
      subtitle,
    };
  });
};

exports.getHentaizOnCategory = async (prefix, id, page, sort) => {
  const url = `${prefix}/${id}/page/${Math.max(+page, 1)}${
    !!sort ? `?orderby=${sort}` : ""
  }`;

  const document = await createDOM(url);

  return {
    blocks: exports.getItemOnBlocks(document),
    title: document.title,
    description: document
      .querySelector('meta[name="description"]')
      .getAttribute("content"),
  };
};
// !(async () => {
//   console.log(
//     await exports.getSrcForIframeVideo({
//       url:
//         "7FNRNrNqNgNeNSNPN.NcNLN.NWN2jGNUN9NaN-NTjhNg7RjpjANMjgNV7QjE7z76jD7kjN7dNbNs7BjA707JjC7wNiNsN.jzN-N0NRNPNGNONXNwNajmNE7-7Z7SNjNW717rfab733318d0520f72007240670b665e813959c363546ea31d10b22514213e989NUjtjUNvNLNhNvNsj6j7jqNnjbNljANHNSjoNdNFjsNcNbjqj_7ljDNJ7vNU72N3jQ7QNiNUNRNRNKjq7.",
//       x: "",
//     })
//   );
// })();
