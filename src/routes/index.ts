import express from 'express';

const routes = express.Router();

const returnHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Example Page</title>
  </head>
  <body>
    <h1>Hello Image</h1>
    <img src="http://localhost:3000/Abfahrt.jpg" alt="Abfahrt">
  </body>
</html>
`

routes.get('/images', (req, res) => {
  console.log(`filename: ${req.query.filename}`);
  console.log(`width: ${req.query.width}`);
  console.log(`heigth: ${req.query.width}`);
 res.send(returnHtml);
});

export default routes;