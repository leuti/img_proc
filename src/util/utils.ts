import sharp from 'sharp';
import express from 'express';

const resize = async function (fullSource: string, thumbSource: string, width: string, height: string, res: express.Response ): Promise<void> {
  try {
    await sharp(fullSource)
      .resize({
        width: parseInt(width),
        height: parseInt(height),
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy
      })
      .toFile(thumbSource);
    console.log('Resized image created');
    res.sendFile(thumbSource);
  } catch (error) {
    console.error(error);
  }
}

// Check if  params are provided and format is OK
const validateParam = function validateParam(paramName: string, paramContent: string, type: string): boolean {
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

export default { resize, validateParam };
