const { PostgresModel } = require('../generics/postgres-model');

// Defines Breaks model
class Breaks extends PostgresModel {
  constructor(data) {
    super(data);
  }

  lookup = 'break_id';
  dataFields = ['region', 'break_id'];

  process = () => {
    if (!this.dbData.length) {
      return {};
    }

    const meta = {
      fields: this.dataFields,
    };

    const data = {
      region: [],
      break_id: [],
    };

    // Flatten dbData, remove traling url and push to data object
    this.dbData.map((breakItem) => {
      meta.fields.map((field) => {
        breakItem[field] = breakItem[field].replace(/\/.*\//, '');
        data[field].push(breakItem[field]);
      });
    });

    // Save processed data
    this.cleanData = { meta, data };
  };
}

module.exports = {
  Breaks,
};
