import express, { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import resize from '../util/utils';

const routes: Router = express.Router();
// const thumbUrl = 'http://localhost:3000/Abfahrt.jpg';

routes.get('/images', (req, res) => {
  const fileName = <string>req.query.filename;
  const width = req.query.width;
  const height = req.query.height;
  
  console.log(`filename: ${fileName}`);
  console.log(`width: ${width}`);
  console.log(`height: ${height}`);

  // Error handling
  if (!fileName) {
    console.log('File not provided')
    res.status(500).send('Filename not provided')

  } else if (!width || typeof width === 'number') {
    console.log('Target width not provided or not a number')
    res.status(500).send('Target width not provided or not a number')

  } else if (!height || typeof height === 'number') {
    console.log('Target height not provided or not a number')
    res.status(500).send('Target height not provided or not a number')

  } else {
    // all provided params are OK
    console.log('All params are OK')
    const fullUrl = path.join(__dirname, '../../assets/full/') + fileName;
    const thumbUrl = path.join(__dirname, '../../assets/thumb/') + path.parse(fileName).name + '_thumb.jpg';

    
    console.log(`path: ${fullUrl}`)

    //  Check if requested file exists as thumb
    fs.stat(thumbUrl).then(() => {
      // if found, the the thumb is directly returned
      console.log(`thumb found at ${thumbUrl}`)
      const returnHtml = `<!DOCTYPE html>
            <html>
              <head>
                <title>Example Page</title>
              </head>
              <body>
                <h1>Hello Image</h1>
                <img src="${thumbUrl}" alt="Thumb of requested image">
              </body>
            </html>
            `
      res.send(returnHtml);
    })
      // if not found, thumb needs to be generated
      .catch((error) => {

        console.log(`error searching thumb ${error}`);
        // first we check if the requested image exists in full folder
        fs.stat(fullUrl).then(() => {
          console.log(`File found: ${fullUrl}`);
          // resize full image and store in thumb folder
          resize(fullUrl, thumbUrl);
        })
          .catch((error) => {
            console.error(`Error generating thumb: ${error}`);
          })
    
        console.error(`File not found: ${error}`);
      })
  }
});

export default routes;