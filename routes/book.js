var express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const xml2js = require("xml2js");
const parseString = require("xml2js").parseString;

var router = express.Router();

const API_KEY = process.env.GOODREADS_API_KEY; 

async function scrapeImg(scrapeUrl, imgUrl) {
  try {
    const response = await axios.get(scrapeUrl);
    const $ = cheerio.load(response.data);
    let coverImgs = $("#coverImage");
    const newImgUrl = coverImgs.length > 0 ? coverImgs[0].attribs.src : imgUrl;
    return newImgUrl;
  } catch(error) {
    console.error(error);
    return error
  }
}

router.post("/", (req, res) => {
  const book = req.body.book;

  // build api URL with user's book input & API KEY 
  const requestUrl = `https://www.goodreads.com/search.xml?key=${API_KEY}&q=${book}`;

  async function getBookDetails() {
    try {
      const { data } = await axios.get(requestUrl);

      // parse the xml data from goodreads to json
      const parsedResponse = await xml2js.parseStringPromise(data /*, options */);
      const parsedData = parsedResponse.GoodreadsResponse.search[0].results;

      // If any of the results don't have a cover image, scrape it and replace in the response
      // let worksList = parsedData[0]['work'];
      // for (let i = 0; i < worksList.length; i++) {
      //   let imgUrl = worksList[i].best_book[0].image_url[0];
      //   if (imgUrl.includes('nophoto')) {
      //     // construct scrape url
      //     const scrapeUrl = `https://goodreads.com/book/show/${worksList[i].best_book[0].id[0]._}`;
      //     const returnedUrl = await scrapeImg(scrapeUrl, imgUrl);
      //     worksList[i].best_book[0].image_url[0] = returnedUrl; 
      //   }
      // }

      res.send(parsedData);

    } catch(error) {
      console.error(error);
      res.send(error);
    }
  }

  getBookDetails();
});

router.post("/details", (req, res) => {
  const bookId = req.body.bookId;

  const requestUrl = `https://www.goodreads.com/book/show.xml?key=${API_KEY}&id=${bookId}`;

  axios
    .get(requestUrl)
    .then(response => {
      parseString(response.data, function(err, result) {
        result = result.GoodreadsResponse.book[0];
        res.send(result);
      });
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

module.exports = router;
