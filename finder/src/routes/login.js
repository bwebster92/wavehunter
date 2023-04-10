const express = require('express');
const { Users } = require('../models/users');

const router = express.Router();

router.post('/api/login', async (req, res) => {
  const userQuery = new Users({ username: req.body.username });
  await userQuery.sync();
  const [userResults] = userQuery.dbData;

  if (!userResults) {
    throw new Error('User lookup error');
  } else {
    console.log(`Loaded user ${userResults.username}`);
  }

  res.status(200).send(userResults);
});

module.exports = {
  loginRouter: router,
};
