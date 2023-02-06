import sharp from 'sharp';

const resize = function (fullSource: string, thumbSource: string): void {
  
  sharp(fullSource)
      .resize({
        width: 300,
        height: 200,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy
      })
      .toFile(thumbSource)
      .then(() => {
        console.log('Resized image created'); 
      })
      .catch((error) => {
        console.error(error);
      });
}

export default resize;