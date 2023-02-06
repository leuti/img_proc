import express, { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import resize from '../util/utils';

const routes: Router = express.Router();
// const thumbSource = 'http://localhost:3000/Abfahrt.jpg';

routes.get('/images', (req, res) => {
  const fileName = <string>req.query.filename;
  const width = req.query.width;
  const height = req.query.height;
  const thumbName = path.parse(fileName).name + '_' + width + '_' + height + '.jpg';
  
  console.log(`filename: ${fileName}`);
  console.log(`width: ${width}`);
  console.log(`height: ${height}`);
  console.log(`baseUrl: ${req.baseUrl}`);

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
    const fullSource = path.join(__dirname, '../../assets/full/', fileName);
    const thumbSource = path.join(__dirname, '../../assets/thumb/', thumbName);
    const host = req.get('host') || ''
    //const thumbUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const thumbUrl = path.join(req.protocol,'://', host , '/assets/thumb/', thumbName);
    
    console.log(`path: ${fullSource}`); 
    console.log(`thumbUrl: ${thumbUrl}`);

    //  Check if requested file exists as thumb
    fs.stat(thumbSource).then(() => {
      // if found, the the thumb is directly returned
      console.log(`thumb found at ${thumbSource} - displaying existing thumb`)
      res.sendFile(thumbSource);
    })
      // if not found, thumb needs to be generated
      .catch((error) => {

        console.log('No thumb file existing');
        // first we check if the requested image exists in full folder
        fs.stat(fullSource).then(() => {
          console.log('Full file found - generating thumb');
          resize(fullSource, thumbSource);
          /*const returnHtml = `<!DOCTYPE html>
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
          */
          res.sendFile(thumbSource);
        })
          .catch((error) => {
            console.error(`Error generating thumb: ${error}`);
          })
    
        console.error(`File not found: ${error}`);
      })
  }
});

export default routes;