const axios = require('axios');
const express = require('express');
const { Scrape } = require('../models/scrape');
const { Forecast } = require('../models/forecast');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/api/forecast', async (req, res) => {
  // Initialise query, sync to db and clean data
  const forecastQuery = new Forecast({ break_id: req.body.break_id });
  await forecastQuery.sync();
  forecastQuery.process();

  // Check which breaks are missing and scrape if needed
  const missingBreaks = req.body.break_id.filter(
    (id) => !forecastQuery.cleanData.breakList.includes(id)
  );
  var scrape_payload = {};

  if (missingBreaks.length) {
    // Look up breaks in ongoing scrapes and remove from list
    const scrapes = new Scrape({});
    const inProgress = await scrapes.find({ completed: false });
    const toScrape = missingBreaks.filter((id) => !inProgress.includes(id));

    if (toScrape.length) {
      scrape_payload = {
        scrape_id: uuidv4(),
        scrape_params: { break_id: toScrape },
      };

      axios
        .post('http://gatherer-svc:3000/scrape', {
          spider: 'sf-forecast',
          scrape_payload,
        })
        .catch((err) => {
          console.log(err.stack);
        });
    }
  }

  // Return data to client
  if (forecastQuery.dbData.length) {
    res.status(200).send({
      forecast: forecastQuery.cleanData,
      scrape: scrape_payload,
    });
  } else {
    res.status(200).send({
      forecast: {},
      scrape: scrape_payload,
    });
  }
});

module.exports = {
  forecastRouter: router,
};
