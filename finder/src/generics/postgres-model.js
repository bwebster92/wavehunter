const { Pool } = require('pg');
const format = require('pg-format');

// This will look for env vars automatically
const pool = new Pool();

class PostgresModel {
  constructor(queryData) {
    if (this.constructor == PostgresModel) {
      throw new Error('Abstract class cannot be instantiated');
    }
    this.queryData = queryData;
    this.dbData = [];
    this.cleanData = null;
    this.table = this.constructor.name
      .replace(/^[A-Z]/, (match) => match.toLowerCase())
      .replace(/[A-Z]/, '_$&')
      .toLowerCase();
  }

  // Create records in db
  save = async () => {
    // Prep
    const sql = format(
      'INSERT INTO %I (%I) VALUES (%L)',
      this.table,
      Object.keys(this.queryData),
      Object.values(this.queryData)
    );

    // Run
    try {
      await pool.query(sql);
      console.log('Record saved to db.');
    } catch (err) {
      console.log(err.stack);
    }
  };

  // Read records matching default lookup value
  sync = async () => {
    const sql = format(
      'SELECT * FROM %I WHERE %I IN (%L);',
      this.table,
      this.lookup,
      this.queryData[this.lookup]
    );

    try {
      let res = await pool.query(sql);
      this.dbData = res.rows;
    } catch (err) {
      console.log(err.stack);
    }
  };

  // Read records matching arbitrary lookup
  find = async (searchObject) => {
    const searchSet = [];
    Object.keys(searchObject).map((key) => {
      searchSet.push(format('%I = %L', key, searchObject[key]));
    });

    const sql = format(
      'SELECT * FROM %I WHERE %s;',
      this.table,
      searchSet.join(' AND ')
    );

    const rows = await pool
      .query(sql)
      .then((res) => res.rows)
      .catch((e) => console.log(e.stack));
    return rows;
  };

  // Read whole table from db
  pull = async () => {
    const sql = format('SELECT * FROM %I;', this.table);

    try {
      let res = await pool.query(sql);
      this.dbData = res.rows;
    } catch (err) {
      console.log(err.stack);
    }
  };

  // Patch update record matching default lookup
  update = async () => {
    const updateSet = [];
    Object.keys(this.queryData).map((key) => {
      updateSet.push(format('%I = %L', key, this.queryData[key]));
    });

    const sql = format(
      'UPDATE %I SET %s WHERE %I = %L;',
      this.table,
      updateSet.join(', '),
      this.lookup,
      this.queryData[this.lookup]
    );

    try {
      let res = await pool.query(sql);
      this.dbData = res.rows;
    } catch (err) {
      console.log(err.stack);
    }
  };

  // Delete logic - not implemented
  static delete = (id) => {
    throw new Error('Delete method not implemented');
    const sql = format(
      'DELETE FROM %I WHERE %I = %L',
      this.table,
      this.lookup,
      id
    );

    return pool.query(sql, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows);
      }
    });
  };
}

module.exports = {
  PostgresModel,
};
