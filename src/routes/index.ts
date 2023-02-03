import express from 'express';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';




//const fs = require('fs').promises;

const routes = express.Router();
// const fullFilePath = '../assets/full/Tanzboden.jpg'

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
  
  const fullFilePath = path.join(__dirname, '../../assets/full/') + req.query.filename
  const thumbFilePath = path.join(__dirname, '../../assets/thumb/') + req.query.filename

  console.log(`path: ${fullFilePath}`)
  // Check if requested file exists - report error if not

  
  fs.stat(fullFilePath).then(() => {
    sharp(fullFilePath)
    .resize({
      width: 300,
      height: 200,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy
    })
    .toFile(thumbFilePath)
    .then(() => {
      console.log('Resized image created');
    })
    .catch((error) => {
      console.error(error);
    });
  }
).catch((error) => {
  console.error(`File not found: ${error}`);
});


  

  // 


 res.send(returnHtml);
});

export default routes;