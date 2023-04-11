const express = require('express');
const axios = require('axios');
const { Breaks } = require('../models/breaks');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.get('/api/breaks', async (req, res) => {
  const breaksQuery = new Breaks();
  await breaksQuery.pull();
  breaksQuery.process();

  console.log(`Retrieved ${breaksQuery.dbData.length} breaks from db`);

  if (breaksQuery.dbData.length) {
    res.status(200).send(breaksQuery.cleanData);
  } else {
    console.log('Requesting scrape...');

    const scrape_payload = {
      scrape_id: uuidv4(),
      scrape_params: {},
    };

    axios
      .post('http://gatherer-svc:3000/scrape', {
        spider: 'sf-breaks',
        scrape_payload,
      })
      .then(async () => {
        res.status(200).send({ scrape_payload });
      })
      .catch((err) => {
        console.log(err.stack);
        res.status(504).send();
      });
  }
});

module.exports = {
  breaksRouter: router,
};
