const { PostgresModel } = require('../generics/postgres-model');

class Scrape extends PostgresModel {
  constructor(queryData) {
    super(queryData);
  }

  lookup = 'scrape_id';
}

module.exports = {
  Scrape,
};
