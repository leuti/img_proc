import express from 'express';
import routes from './routes/index';
import path from 'path';
//import checkThumb from './util/utils';

const app = express();
const port = 3000;

app.use('/api', routes);
//app.use('/assets/thumb', express.static('/assets/thumb'))

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/thumb/:fileName', (req, res) => {
  console.log('in toplevel get');
  res.sendFile(path.join(__dirname, 'assets', 'thumb', req.params.fileName));
});

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
