import express from 'express';
import routes from './routes/index';
//import checkThumb from './util/utils';

const app = express();
const port = 3000;

app.use('/api', routes);
//app.use(express.static('assets/full'))

app.listen(port, ()=> {
 console.log(`server started at localhost:${port}`)
});