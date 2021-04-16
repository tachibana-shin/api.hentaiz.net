const axios = require("../../cache-axios");
const { JSDOM } = require("jsdom");

async function getBodyContent(url) {
  const { data } = await axios.get(encodeURI(url));

  const {
    window: { document },
  } = new JSDOM(data);

  if (document.querySelectorAll("iframe").length === 0) {
    Array.from(
      document.querySelectorAll("script[async] + script, script[async")
    ).forEach((script) => script.remove());

    const script = document.createElement("script");
    script.src = `${process.env.CAWRL_URL}/wp-content/themes/hz2/js/8.19.0.fix.js`;

    document.head.prepend(script);
    return (
      `<div id="media-player"></div><script> var meta </script>` +
      document.head.innerHTML
    );
  } else {
    return document.querySelector("iframe").outerHTML;
  }
}

async function createHTML(url) {
  const body = await getBodyContent(url);

  return `
      <html>
         <head>
            <title> Xem phim Hentaiz </title>
            <style>
              html, body {
                border: 0px;
                margin: 0px;
                padding: 0px;
              }
              * {
                margin: 0;
                padding: 0
              }
              iframe {
                width: 100%;
                height: 100%;
                border: 0;
                frameborder: 0;
                line-height: 0;
                display: block;
              }
            </style>
         </head>
         <body>
            ${body}
         </body>
      </html>
   `;
}

exports.get = async ({ query: { url = null, x = "" } }, res) => {
  if (url !== null) {
    try {
      const html = await createHTML(
        `${process.env.CAWRL_URL}/wp-admin/admin-ajax.php?action=hx_gl&url=${url}&x=${x}`
      );

      res.send(html);
    } catch (e) {
      res.status(404).end("Not Found");
    }
  } else {
    res.status(404).end("Not Found");
  }
};
