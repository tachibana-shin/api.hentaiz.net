const { toResolvePath, createDOM, trim } = require("../../utils");

const router = require("express").Router();
const axios = require("../../cache-axios");
const { getItemOnCarousel } = require("../../helpers");

function getKeyAndValueAnimeInfo(animeInfo) {
  const name = trim(animeInfo.textContent.match(/^([^:]+):/)[1]);
  const aEl = animeInfo.querySelectorAll("a");

  if (aEl.length > 0) {
    return {
      name,
      children: Array.from(aEl).map((item) => {
        return {
          text: trim(item.textContent),
          href: toResolvePath(item.getAttribute("href")),
        };
      }),
    };
  } else {
    return {
      name,
      text: trim(animeInfo.textContent.replace(/^([^:]+):/, "")),
    };
  }
}

async function getTrailer(html) {
  const document = await createDOM(html, true);

  return {
    photo: document.querySelector(".anime-thumbnail").getAttribute("src"),
    name: document.querySelector(".anime-name > h1").textContent,
    description: document.querySelector(".description > p")?.innerHTML,
    information: [...document.querySelectorAll(".anime-info")].map(
      getKeyAndValueAnimeInfo
    ),
    nameJapan: getKeyAndValueAnimeInfo(
      document.querySelector(".anime-info .fa-language").parentElement
    )?.text,
  };
}
function getChapters(document) {
  const chapters = Array.from(
    document.querySelectorAll(
      ".alert.alert-warning + a, .alert.alert-warning + a ~ a"
    )
  ).map((item) => {
    return {
      name: item.textContent,
      value: +item.getAttribute("href").match(/tap\-(\d+)\.html?/)[1],
    };
  });

  if (chapters.length > 0) {
    return chapters;
  } else {
    return [{ name: "1", value: "1" }];
  }
}
async function getChapter(html) {
  const document = await createDOM(html, true);

  const iframeDefaultInMediaPlayer = document.querySelector(
    "#media-player iframe"
  );

  /////// get iframe default
  const srcIframeDefault =
    iframeDefaultInMediaPlayer &&
    iframeDefaultInMediaPlayer.getAttribute("src");

  const chapters = getChapters(document);

  return {
    servers: [
      ...(srcIframeDefault ? [{ name: "Deft", src: srcIframeDefault }] : []),
      ...Array.from(document.querySelectorAll(".doiserver")).map((item) => {
        return {
          name: trim(item.textContent),
          src: `${process.env.BASE_URL}/iframe-video?url=${item.getAttribute(
            "data-href"
          )}&x=${item.getAttribute("data-x")}`,
        };
      }),
    ],
    chapters,
    haveYouLike: getItemOnCarousel(
      document.querySelectorAll("#owl-demo .item")
    ),
  };
}

router
  .route("/hentai/:id")
  .get(
    async (
      { params: { id }, query: { onlyUrl = false, chapter = 1 } },
      res
    ) => {
      try {
        if (!onlyUrl) {
          const [pageTrailer, pageVideo] = await Promise.all([
            axios.get(encodeURI(`${process.env.CAWRL_URL}/${id}`)),
            axios.get(
              encodeURI(
                `${process.env.CAWRL_URL}/${id}/xem-phim/tap-${Math.max(
                  +chapter,
                  1
                )}.html`
              )
            ),
          ]);
          res.json({
            ...(await getTrailer(pageTrailer.data)),
            ...(await getChapter(pageVideo.data)),
          });
        } else {
          res.json({
            ...(await getChapter(
              (
                await axios.get(
                  encodeURI(
                    `${process.env.CAWRL_URL}/${id}/xem-phim/tap-${Math.max(
                      +chapter,
                      1
                    )}.html`
                  )
                )
              ).data
            )),
          });
        }
      } catch (e) {
        console.log(e);
        res.status(404).end(`Error ${404}`);
      }
    }
  );

module.exports = router;
