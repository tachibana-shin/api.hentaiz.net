const path = require("path");
const { createDOM, trim, toResolvePath } = require("../../utils");

const blacklists = ["page-sitemap"];

async function getSitemap(loc, prefix = "") {
  const document = await createDOM(`${process.env.CAWRL_URL}/${loc}`);
  const sitemaps = document.querySelectorAll("sitemap, url");

  return (
    await Promise.all(
      Array.from(sitemaps).map(async (sitemap) => {
        const [locNoShip, lastmod] = [
          toResolvePath(trim(sitemap.querySelector("loc").textContent)),
          trim(sitemap.querySelector("lastmod")?.textContent),
        ];

        const ext = path.extname(locNoShip);
        const loc = locNoShip.replace(/^\/|\.xml$/g, "");

        if (!blacklists.includes(loc)) {
          if (trim(ext) === ".xml") {
            ///await
            return {
              loc: `${prefix}/${loc}`,
              lastmod,
              children: await getSitemap(
                `${loc}.xml`,
                loc.includes("post-") ? "/hentai" : ""
              ),
            };
          } else {
            return {
              loc: `${prefix}/${loc}`,
              lastmod,
            };
          }
        } else {
          return null;
        }
      })
    )
  ).filter(Boolean);
}

exports.get = async (req, res) => {
  res.json(await getSitemap("sitemap.xml"));
};
