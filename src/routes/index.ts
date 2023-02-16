// import required modules
import express, { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

// import own functions
import utils from '../util/utils';

const routes: Router = express.Router(); // create router

// return welcome message if root location is visited
routes.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to the image processor');
});

// process requests sent to api/images
routes.get('/images', (req: Request, res: Response) => {
  try {
    // Derive required variables
    const filename = req.query.filename as unknown as string; // filename provided by the endpoint
    const width = <string>req.query.width; // width provided
    const height = <string>req.query.height; // height provided
    const thumbName =
      path.parse(filename).name + '_' + width + '_' + height + '.jpg'; // target name of the thumb file
    const fullSource = path.join(__dirname, '../../assets/full/', filename); // path to full source file
    const thumbSource = path.join(__dirname, '../../assets/thumb/', thumbName); // patch to thumb file

    // Valdiate the params
    utils.validateParam('filename', filename, 'string'); // Valdiate the filename param
    utils.validateParam('width', width, 'number'); // Valdiate the width param
    utils.validateParam('height', height, 'number'); // validate the height

    //  First check if requested image already exists as thumb
    fs.stat(thumbSource)
      .then(() => {
        // if thumb file exists, the the thumb is directly returned
        res.status(200).sendFile(thumbSource); // send thumb back to end point
      })
      // if thumb is not found, the catch is triggered and thumb is generated
      .catch(() => {
        // first we check if the requested image exists in full format
        fs.stat(fullSource)
          .then(() => {
            // If full image exists, it is resized
            utils.resize(fullSource, thumbSource, width, height, res);
          })
          // if the resize returns an error, this catch is called
          .catch(() => {
            res.status(400).send(`Requested file ${filename} was not found.`);
          });
      });
  } catch (error) {
    // return any other encountered error
    const errorMsg: unknown = error;
    res.status(400).send((errorMsg as { message: string }).message);
  }
});

export default routes;
