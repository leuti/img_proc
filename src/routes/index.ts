import express, { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import utils from '../util/utils';

const routes: Router = express.Router();

routes.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to the image processor');
});

routes.get('/images', (req: Request, res: Response) => {
  try {
    // console.log('checking params');
    const filename = req.query.filename as unknown as string; // filename provided by the endpoint
    const width = <string>req.query.width; // width provided
    const height = <string>req.query.height; // height provided
    const thumbName =
      path.parse(filename).name + '_' + width + '_' + height + '.jpg'; // target name of the thumb file
    const fullSource = path.join(__dirname, '../../assets/full/', filename); // path to full source file
    const thumbSource = path.join(__dirname, '../../assets/thumb/', thumbName); // patch to thumb file
    const thumbUrl = path.join(
      req.protocol,
      '://',
      req.get('host') || '',
      '/assets/thumb/',
      thumbName
    ); // external URL pointing pointing to requested thumb file

    // Valdiate the params
    utils.validateParam('filename', filename, 'string'); // Valdiate the filename param
    utils.validateParam('width', width, 'number'); // Valdiate the width param
    utils.validateParam('height', height, 'number'); // validate the height

    // console.log('checking params completed without errors');

    // continue as all params are OK

    // assign all variables

    // console.log(`filename: ${filename}`);
    // console.log(`width: ${width}`);
    // console.log(`height: ${height}`);
    // console.log(`baseUrl: ${req.baseUrl}`);
    // console.log(`path: ${fullSource}`);
    // console.log(`thumbUrl: ${thumbUrl}`);

    //  Check if requested file exists as thumb
    fs.stat(thumbSource)
      .then(() => {
        // if found, the the thumb is directly returned
        // console.log(`thumb found at ${thumbSource} - displaying existing thumb`);
        res.sendFile(thumbSource);
      })
      // if not found, thumb needs to be generated
      .catch(() => {
        // console.log('No thumb file existing');
        // first we check if the requested image exists in full folder
        fs.stat(fullSource)
          .then(() => {
            // console.log('Full file found - generating thumb');
            // Change this to a promise based call. Send thumb only when finished
            utils.resize(fullSource, thumbSource, width, height, res);
          })
          .catch((error) => {
            //console.error(`Error generating thumb: ${error}`);
            res
              .status(400)
              // .send('Requested file not found; no thumb generated');
              .send(error.message);
          });

        //console.error(`File not found: ${error}`);
      });
  } catch (error) {
    const errorMsg: unknown = error;
    // console.log(`====> error: ${errorMsg}`);
    res.status(400).send((errorMsg as { message: string }).message);
  }
});

export default routes;
