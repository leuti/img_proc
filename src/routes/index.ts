import express, { Router, Request, Response, RequestHandler } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import resize from '../util/utils';

const routes: Router = express.Router();
// const thumbSource = 'http://localhost:3000/Abfahrt.jpg';

// Check if  params are provided and format is OK
function validateParam(paramName: string, paramContent: string, type: string): boolean {
  console.log(`Entered validateParam function with param name "${paramName}", content is "${paramContent}" and type "${type}"`);
  if (!paramContent) {
    console.log(`Param name ${paramName} not provided`);
    throw new Error(`Param name ${paramName} not provided`);
  }
  
  if ( type === 'number' && isNaN((paramContent as unknown) as number) && isNaN(parseFloat(paramContent))) {
    console.log(`Param name "${paramName}" should be a number, but the value "${paramContent}" has been provided.`);
    throw new Error(`Param name ${paramName} not provided`);
  }
  console.log(`Params OK`);
  return true
}

/*
function validateWidth(req: Request): void {
  console.log(`Entered validateWidth function - width ${req.query.width}`);
  const parsedWidth = String(req.query.width)
  if (typeof parsedWidth === 'undefined' || !parsedWidth ) {
    console.log('width not correctly ' + parsedWidth);
    throw new Error('width not correctly provided: Must be number');
  }
  else
    
    if ( isNaN(parseFloat(parsedWidth))) {
    throw new Error('Target width not a number');
  }
  else true
}

function validateHeight(req: Request): void {
  console.log('Entered validateHeigth function');
  if (!req.query.heigth) {
    console.log('height missing' + req.query.heigth);
    throw new Error('height not provided');
  } else if (typeof req.query.width !== 'number') {
    throw new Error('Target height not a number');
  }
  else true
}
*/

routes.get('/images', (req:Request, res:Response) => {
  
  try {
    /* interface QueryTypes {
      filename: string,
      width: string,
      height: string
    }*/
    console.log('checking params');
    // const filename: RequestHandler<unknown, unknown, unknown, QueryTypes> = req.query.filename;  // filename provided by the endpoint
    // const filename = <string>req.query.filename;  // filename provided by the endpoint
    // const filename = req.query.filename as string;  // filename provided by the endpoint
    const filename = (req.query.filename as unknown) as string;  // filename provided by the endpoint

    const width = <string>req.query.width;  // width provided
    const height = <string>req.query.height;  // height provided
    const thumbName = path.parse(filename).name + '_' + width + '_' + height + '.jpg'; // target name of the thumb file
    const fullSource = path.join(__dirname, '../../assets/full/', filename); // path to full source file
    const thumbSource = path.join(__dirname, '../../assets/thumb/', thumbName); // patch to thumb file
    const thumbUrl = path.join(req.protocol,'://', req.get('host') || '' , '/assets/thumb/', thumbName); // external URL pointing pointing to requested thumb file
    
    // validateParam(filename) // Valdiate the filename param
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
    console.log(`error: ${error}`);
    res.status(400).send({ error: error })
  }
});

export default routes;