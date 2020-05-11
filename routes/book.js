var express = require("express");
const axios = require("axios");
const parseString = require("xml2js").parseString;

var router = express.Router();

const API_KEY = process.env.GOODREADS_API_KEY; 

router.post("/", (req, res) => {
  const book = req.body.book;

  // build api URL with user's book input & API KEY 
  const requestUrl = `https://www.goodreads.com/search.xml?key=${API_KEY}&q=${book}`;
  console.log(requestUrl);

  // this is a promise pattern - switch up to async / await?
  axios
    .get(requestUrl)
    .then(response => {
      parseString(response.data, function(err, result) {
        result = result.GoodreadsResponse.search[0].results;
        res.send(result);
      });
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
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
