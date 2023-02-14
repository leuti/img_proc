import express, { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import resize from '../util/utils';

const routes: Router = express.Router();
// const thumbSource = 'http://localhost:3000/Abfahrt.jpg';

// Check if  params are provided and format is OK
function validateParam(paramName: string, paramContent: string, type: string): boolean {
  console.log(`Entered validateParam function with param name "${paramName}", content is "${paramContent}" and type "${type}"`);
  if (!paramContent) {
    console.log(`Parameter ${paramName} not provided. Please provide valid ${paramName} of type ${type}`);
    throw new Error(`Parameter ${paramName} not provided. Please provide valid ${paramName} of type ${type}`);
  }
  
  if ( type === 'number' && isNaN((paramContent as unknown) as number) && isNaN(parseFloat(paramContent))) {
    console.log(`Parameter "${paramName}" should be a number, but the value "${paramContent}" has been provided.`);
    throw new Error(`Parameter "${paramName}" should be a number, but the value "${paramContent}" has been provided.`);
  }
  console.log(`Params OK`);
  return true
}

routes.get('/images', (req:Request, res:Response) => {
  
  try {
    console.log('checking params');
    const filename = (req.query.filename as unknown) as string;  // filename provided by the endpoint
    const width = <string>req.query.width;  // width provided
    const height = <string>req.query.height;  // height provided
    const thumbName = path.parse(filename).name + '_' + width + '_' + height + '.jpg'; // target name of the thumb file
    const fullSource = path.join(__dirname, '../../assets/full/', filename); // path to full source file
    const thumbSource = path.join(__dirname, '../../assets/thumb/', thumbName); // patch to thumb file
    const thumbUrl = path.join(req.protocol,'://', req.get('host') || '' , '/assets/thumb/', thumbName); // external URL pointing pointing to requested thumb file
    
    // Valdiate the params
    validateParam('filename', filename, 'string'); // Valdiate the filename param
    validateParam('width', width, 'number'); // Valdiate the width param
    validateParam('height', height, 'number') // validate the heigth

    console.log('checking params completed without errors');
    
    // continue as all params are OK
    
    // assign all variables
    
    console.log(`filename: ${filename}`);
    console.log(`width: ${width}`);
    console.log(`height: ${height}`);
    console.log(`baseUrl: ${req.baseUrl}`);
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
    //const errorMsg: unknown = error;
    const errorMsg: unknown = error;
    // res.status(400).send('this is the error code')
    // res.status(400).send(error as string)
    // res.status(400).send(error)
    console.log(`====> error: ${errorMsg}`);
    //res.status(400).send(errorMsg)
    res.status(400).send((errorMsg as { message: string }).message);
  }
});

export default routes;