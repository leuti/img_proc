import express from 'express';

const routes = express.Router();

routes.get('/', (req, res) => {
 res.send('Main api route');
});

export default routes;