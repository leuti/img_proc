import express, { Router } from 'express';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const routes: Router = express.Router();
// const thumbUrl = 'http://localhost:3000/Abfahrt.jpg';
let thumbUrl = '';
const thumbAlt = '';
let fullUrl = '';

routes.get('/images', (req, res) => {
  console.log(`filename: ${req.query.filename}`);
  console.log(`width: ${req.query.width}`);
  console.log(`heigth: ${req.query.width}`);
  
  fullUrl = path.join(__dirname, '../../assets/full/') + req.query.filename
  thumbUrl = path.join(__dirname, '../../assets/thumb/') + req.query.filename

  console.log(`path: ${fullUrl}`)

  // Check if requested file exists - report error if not
  fs.stat(fullUrl).then(() => {

    sharp(fullUrl)
      .resize({
        width: 300,
        height: 200,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy
      })
      .toFile(thumbUrl)
      .then(() => {
        console.log('Resized image created');
        const returnHtml = `<!DOCTYPE html>
          <html>
            <head>
              <title>Example Page</title>
            </head>
            <body>
              <h1>Hello Image</h1>
              <img src="${thumbUrl}" alt="${thumbAlt}">
            </body>
          </html>
          `
        res.send(returnHtml);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  ).catch((error) => {
    console.error(`File not found: ${error}`);
  });
  
});

export default routes;