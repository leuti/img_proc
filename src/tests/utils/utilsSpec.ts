// import required modules and functions for testing
import utils from '../../util/utils';

describe('Test util function validateParam', () => {
  it('should return true if filename is provided', () => {
    const result = utils.validateParam('filename', 'Tanzboden.jpg', 'string');
    expect(result).toBe(true);
  });
  it('should throw error if width is not a number', () => {
    expect(() => {
      utils.validateParam('width', 'string', 'number');
    }).toThrowError();
  });
  it('should throw error if height is not provided', () => {
    expect(() => {
      utils.validateParam('height', '', 'number');
    }).toThrowError();
  });
});
