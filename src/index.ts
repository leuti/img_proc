// import required modules
import express from 'express';
import debug from 'debug'; // debug package

// import own routes modules
import routes from './routes/index';

const app = express(); // create express app
const port = 3000; // set standard port
const log = debug('http'); // create log object

// is is the main root
app.use('/api', routes);

// Route to serve thumbnail images located in the assets/thumb
app.get('/thumb/:fileName', () => {
  // all code handled in routes
});

// start server
app.listen(port, () => {
  log(`server started at localhost:${port}`);
});

export default app;
