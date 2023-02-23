// import required modules
import sharp from 'sharp';
import express from 'express';
import path from 'path';
import fs from 'fs';
import debug from 'debug'; // debug package

const log = debug('http'); // create log object

// function resizes a given image to a target size
const resize = async function (
  fullSource: string, // full path to source file
  thumbSource: string, // full patch to thumb file
  width: string, // target width of the thumb
  height: string, // target height of the thumb
  res: express.Response // express response object
): Promise<void> {
  const thumbDir = path.join(__dirname, '../../assets/thumb/'); // thumb directory

  // check if thumb dir exists and create if not
  fs.access(thumbDir, (err) => {
    if (!err) {
      log(thumbDir, 'directory already exists');
    } else if (err.code === 'ENOENT') {
      fs.mkdirSync(thumbDir);
      log(thumbDir, 'created successfully... ');
    }
  });

  try {
    // resize image async using the sharp module
    await sharp(fullSource)
      .resize({
        width: parseInt(width), // target width
        height: parseInt(height), // target height
        fit: sharp.fit.cover, // cuts the image to fit into given size
        position: sharp.strategy.entropy, //  most visually interesting part of the image will be retained
      })
      .toFile(thumbSource); // save file in given location
    res.status(200).sendFile(thumbSource); // send thumb back to end point
  } catch (error) {
    throw new Error(`Error resizing provided source image: ${error}`); // throw error if resize fails
  }
};

// Function to check if arams are provided and data type is OK
const validateParam = function validateParam(
  paramName: string, // specifies the param to be validated (filename, width, height)
  paramContent: string, // content of the above param
  type: string // data type expected
): boolean {
  // check if parameter has been provided
  if (!paramContent) {
    throw new Error(
      `Parameter ${paramName} not provided. Please provide valid ${paramName} of type ${type}`
    );
  }

  // check if approprate data type
  if (
    type === 'number' &&
    isNaN(paramContent as unknown as number) &&
    isNaN(parseFloat(paramContent))
  ) {
    throw new Error(
      `Parameter "${paramName}" should be a number, but the value "${paramContent}" has been provided.`
    );
  }
  return true;
};

export default { resize, validateParam };
