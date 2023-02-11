import express, { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import resize from '../util/utils';

const routes: Router = express.Router();
// const thumbSource = 'http://localhost:3000/Abfahrt.jpg';

// Check if  params are provided and format is OK
function checkParams(req:Request):boolean {
  if (!req.query.fileName) {
    throw new Error('File name not provided');
  } else if (!req.query.width || typeof req.query.width === 'number') {
    throw new Error('Target width not provided or not a number');
  } else if (!req.query.height || typeof req.query.height === 'number') {
    throw new Error('Target height not provided or not a number');
  } else {
    return true
  }
}

routes.get('/images', (req:Request, res:Response) => {
  const params = {
    fileName: <string>req.query.filename,
    width: req.query.width,
    height: req.query.height
  }
  const thumbName = path.parse(params.fileName).name + '_' + params.width + '_' + params.height + '.jpg';
  
  console.log(`filename: ${params.fileName}`);
  console.log(`width: ${params.width}`);
  console.log(`height: ${params.height}`);
  console.log(`baseUrl: ${req.baseUrl}`);

  // Error handling
  try {
    checkParams(req)
    // continue as all params are OK
    console.log('All params are OK')
    const fullSource = path.join(__dirname, '../../assets/full/', params.fileName);
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
          // Change this to a promise based call. Send thumb only when finished
          resize(fullSource, thumbSource, res);
        })
          .catch((error) => {
            console.error(`Error generating thumb: ${error}`);
          })
    
        console.error(`File not found: ${error}`);
      })
  } catch (error) {
    // return error to end point
    res.status(500).send(error)
  }
});

export default routes;