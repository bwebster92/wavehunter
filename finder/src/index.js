const { app } = require('./app');

const start = async () => {
  console.log('Starting finder API...');
  // Perform startup check here:
  //
  // DB connection params in env?
  // DB available? -> timeout loop

  app.listen(3000, () => {
    console.log('Finder API ready...');
  });
};

start();
