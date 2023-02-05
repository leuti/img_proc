import sharp from 'sharp';

const resize = function (fullUrl: string, thumbUrl: string): void {
  
  sharp(fullUrl)
      .resize({
        width: 300,
        height: 200,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy
      })
      .toFile(thumbUrl)
      .then(() => {
        console.log('Resized image created'); 
      })
      .catch((error) => {
        console.error(error);
      });
}

export default resize;