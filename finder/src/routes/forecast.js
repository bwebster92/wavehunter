const axios = require('axios');
const express = require('express');
const { Scrape } = require('../models/scrape');
const { Forecast } = require('../models/forecast');

const router = express.Router();

router.post('/api/forecast', async (req, res) => {
  // Start query, sync to db and clean data
  const forecastQuery = new Forecast({ break_id: req.body.break_id });
  await forecastQuery.sync();
  forecastQuery.process();

  // Check which breaks are missing and scrape if needed
  const missingBreaks = req.body.break_id.filter(
    (id) => !forecastQuery.cleanData.breakList.includes(id)
  );

  if (missingBreaks.length) {
    // Look up breaks in ongoing scrapes and remove from list
    const scrapes = new Scrape({});
    const inProgress = await scrapes.find({ completed: false });
    const toScrape = missingBreaks.filter((id) => !inProgress.includes(id));

    if (toScrape.length) {
      var scrape_payload = {
        scrape_id: 'testparky', // Use an id generator here
        scrape_params: { break_id: toScrape },
        completed: false,
        // Add timestamps
      };

      axios
        .post('http://gatherer-svc:3000/scrape', {
          spider: 'sf-forecast',
          scrape_payload,
        })
        .then(async (res) => {
          const scrape = new Scrape(scrape_payload);
          await scrape.save();
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
