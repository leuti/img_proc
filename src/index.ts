// import required modules
import express from 'express';
import path from 'path';

// import own routes modules
import routes from './routes/index';

const app = express(); // create express app
const port = 3000; // set standard port

// is is the main root
app.use('/api', routes);

// Serves static files located in the assets directory
app.use(express.static(path.join(__dirname, 'assets')));

// Route to serve thumbnail images located in the assets/thumb
app.get('/thumb/:fileName', (req, res) => {
  // res.sendFile(path.join(__dirname, 'assets', 'thumb', req.params.fileName));
});

// start server
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

export default app;
