const { PostgresModel } = require('../generics/postgres-model');

// Defines Forecast model
class Forecast extends PostgresModel {
  constructor(queryData) {
    super(queryData);
  }

  lookup = 'break_id';
  metaFields = ['last_updated', 'break_id'];
  dataFields = [
    'forecast_time',
    'swell_info',
    'wind_speed',
    'wind_direction',
    'wind_state',
  ];

  process = () => {
    // Exit if no data
    if (!this.dbData.length) {
      this.cleanData = {
        breakList: [],
        breakData: {},
      };
      return 0;
    }

    // Target data structure:
    const forecastTemplate = {
      meta: {
        last_updated: '',
        break_id: '',
        is_updated: false,
      },
      data: {
        forecast_time: [],
        swell_info: [],
        wind_speed: [],
        wind_direction: [],
        wind_state: [],
      },
    };

    // Load templates for each break
    let breakData = {};
    this.queryData.break_id.map((key) => {
      breakData[key] = JSON.parse(JSON.stringify(forecastTemplate));
      breakData[key].meta.break_id = key;
    });

    // Write each row of db data to template
    let breakList = [];
    this.dbData.map((item) => {
      if (!breakData[item.break_id].meta.is_updated) {
        // If first observation for break, change that break's status to updated
        breakData[item.break_id].meta.last_updated = item.last_updated;
        breakList.push(item.break_id);
        breakData[item.break_id].meta.is_updated = true;
      }
      // Add each col in obs to output
      this.dataFields.map((field) => {
        breakData[item.break_id].data[field].push(item[field]);
      });
    });

    // Save results
    this.cleanData = {
      breakList,
      breakData,
    };
  };
}

module.exports = {
  Forecast,
};
