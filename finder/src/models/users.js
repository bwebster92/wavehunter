const { PostgresModel } = require('../generics/postgres-model');

// Defines Users model
class Users extends PostgresModel {
  constructor(data) {
    super(data);
  }

  lookup = 'username';
}

module.exports = {
  Users,
};
