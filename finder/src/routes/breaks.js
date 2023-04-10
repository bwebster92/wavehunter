const express = require('express');
const axios = require('axios');
const { Breaks } = require('../models/breaks');
const { Scrape } = require('../models/scrape');

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
      scrape_id: 'testbreaks',
      scrape_params: {},
      completed: false,
    };

    axios
      .post('http://gatherer-svc:3000/scrape', {
        spider: 'sf-breaks',
        scrape_payload,
      })
      .then(async () => {
        // Move this to gatherer
        const scrape = new Scrape(scrape_payload);
        await scrape.save();

        res.status(200).send({});
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
