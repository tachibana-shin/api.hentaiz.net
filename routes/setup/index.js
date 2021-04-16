const axios = require("../../cache-axios");
const { createDOM, toResolvePath } = require("../../utils");

function getOptions(document, name) {
  return Array.from(
    document.querySelectorAll(`select[name="${name}"] > option`)
  ).map((item) => {
    return {
      value: item.getAttribute("value"),
      text: item.textContent,
    };
  });
}

async function getNavBar() {
  const { data } = await axios.get(encodeURI(`${process.env.CAWRL_URL}`));

  const document = await createDOM(data, true);

  return Array.from(
    document.querySelectorAll(
      "#bs-example-navbar-collapse-1 > ul, #bs-example-navbar-collapse-1 > li"
    )
  )
    .map((item) => {
      if (item.tagName === "LI") {
        const a = item.querySelector("a");
        return {
          text: a.textContent,
          href: toResolvePath(a.getAttribute("href")),
        };
      } else {
        const lis = item.children;

        return Array.from(lis).map((li) => {
          const ul = li.querySelector("ul");
          const a = li.querySelector("a");

          if (ul) {
            const a = li.querySelector(".dropdown-toggle");

            return {
              text: a.textContent,
              children: Array.from(ul.querySelectorAll("li")).map((item) => {
                const a = item.querySelector("a");
                return {
                  text: a.textContent,
                  href: toResolvePath(a.getAttribute("href")),
                  tooltip: a.getAttribute("title"),
                };
              }),
            };
          } else {
            const href = toResolvePath(a.getAttribute("href"));

            if (href === "/login") {
              return null;
            } else {
              return {
                text: a.textContent,
                href,
              };
            }
          }
        });
      }
    })
    .flat(2)
    .filter(Boolean);
}
async function getOptionSearch() {
  const { data } = await axios.get(encodeURI(`${process.env.CAWRL_URL}?s=0`));

  const document = await createDOM(data, true);

  const categories = Array.from(
    document.querySelectorAll('input[type="checkbox"][name="hxgenres[]"]')
  ).map((checkbox) => {
    return {
      value: checkbox.getAttribute("value"),
      label: document.querySelector(
        `label[for="${checkbox.getAttribute("id")}"]`
      ).textContent,
    };
  });
  const producer = getOptions(document, "hxproducer");
  const year = getOptions(document, "hxyear");
  const type = getOptions(document, "hxtype");

  return {
    categories,
    producer,
    year,
    type,
  };
}

exports.get = async ({ query: { type } }, res) => {
  switch (type) {
    case "navbar":
      res.json(await getNavBar());
      break;
    case "search":
      res.json(await getOptionSearch());
      break;
    default:
      res.status(404).end("Not Found");
  }
};
