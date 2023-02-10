import sharp from 'sharp';
import express from 'express';

const resize = async function (fullSource: string, thumbSource: string, res: express.Response ): Promise<void> {
  try {
    await sharp(fullSource)
      .resize({
        width: 300,
        height: 200,
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

export default resize;