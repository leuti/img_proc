// import required modules and functions for testing
import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test endpoint responses', () => {
  it('gets the api endpoint', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    // done(); // build script complained about these done statements and recommended removal
  });
  it('gets the image endpoint', async () => {
    const response = await request.get('/api/images?filename=Tanzboden.jpg');
    expect(response.status).toBe(400);
    // done(); // build script complained about these done statements and recommended removal
  });
});
