const express = require('express');
const { json } = require('body-parser');

const { forecastRouter } = require('./routes/forecast');
const { breaksRouter } = require('./routes/breaks');
const { loginRouter } = require('./routes/login');
const { scrapeRouter } = require('./routes/scrape');

const app = express();
app.use(json());
app.use(forecastRouter);
app.use(breaksRouter);
app.use(loginRouter);
app.use(scrapeRouter);

app.all('*', async (req, res) => {
  throw new Error('Route not found');
});

module.exports = { app };
