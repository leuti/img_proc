# Image Resizing API

This is a Node.js-based API for resizing images using the Sharp module. The API uses Express to handle incoming requests, and Sharp to process images.

## Getting started

To get started with this API, you'll need to follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install`.
3. Run `npm run test` to build and test the API
4. Run `npm run nodemon` to start the image processing API

Once the server is running, you can make requests to it using a tool like cURL or Postman.

## Running in debug mode

To run the API in debug mode run the following command: `npm run windowsDebug`

## API endpoints

This is a project for a Udacity full stack course. The following endpoints are available in this API:

http://localhost:3000/api/images?filename=Tanzboden.jpg&width=300&height=200

Where

- filename is an image name stored under assets/full/
- width and height are the target pixels of the required thumb
