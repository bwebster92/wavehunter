const express = require('express');
const { Scrape } = require('../models/scrape');

const router = express.Router();

// From gatherer - update spider status **REDUNDANT - do this directly from gatherer**
router.put('/api/scrape', async (req, res) => {
  const scrape = new Scrape(req.body);
  await scrape.update();

  res.status(200).send({});
});

// From hunter - check spider status
router.post('/api/scrape', async (req, res) => {
  const scrape = new Scrape(req.body);
  await scrape.sync();
  const [scrapeResults] = scrape.dbData;

  if (!scrapeResults) {
    throw new Error('Scrape lookup error');
  }

  if (!scrapeResults.completed) {
    // retry loop - poll db for scraped data
  }

  res.status(200).send(scrapeResults);
});

module.exports = {
  scrapeRouter: router,
};
