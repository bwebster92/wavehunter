const express = require('express');
const { Scrape } = require('../models/scrape');

const router = express.Router();

// From hunter - check spider status
router.post('/api/scrape', async (req, res) => {
  const scrape = new Scrape(req.body);

  const retrieveScrape = async (scrape) => {
    await scrape.sync();
    const [scrapeStatus] = scrape.dbData;

    if (!scrapeStatus) {
      throw new Error('Scrape lookup error');
    } else if (scrapeStatus.completed) {
      res.status(200).send(scrapeStatus);
    } else if (!scrapeStatus.completed) {
      setTimeout(retrieveScrape, 300);
    }
  };

  retrieveScrape(scrape);
});

module.exports = {
  scrapeRouter: router,
};
