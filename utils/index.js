const cheerio = require("cheerio");
const axios = require("../cache-axios");
const { JSDOM } = require("jsdom");

exports.create$ = async (curl, isDocument) => {
  const html = isDocument ? curl : (await axios.get(encodeURI(curl))).data;
  const $ = cheerio.load(html);

  $.prototype.map = function (callback) {
    const result = [];

    this.each((index, item) => {
      result.push(callback(item, index));
    });

    return result;
  };
  return $;
};

exports.createDOM = async (curl, isDocument) => {
  const html = isDocument ? curl : (await axios.get(encodeURI(curl))).data;

  return new JSDOM(html).window.document;
};

exports.toResolvePath = (url) => {
  return "/" + url.replace(/^https?:\/\/?[^/]+\//, "");
};

exports.separationCaption = (caption) => {
  const [title, subtitle] = [
    this.trim(caption.childNodes[0].nodeValue),
    this.trim(caption.childNodes[2]?.nodeValue.replace(" lượt xem", "")),
  ];

  return {
    title,
    subtitle,
  };
};

exports.trim = (text) => text?.replace(/^\s+|\s+$/g, "");
