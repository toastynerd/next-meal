
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const https = require('https');

var mealRouter = module.exports = exports = Router();

mealRouter.get('/meals', bodyParser, (req, res) => {
  https.get('https://data.seattle.gov/resource/47rs-c243.json', (response) => {
    console.log('status code: ' + response.statusCode);
    console.log('headers: ' + response.headers);

    response.on('data', (data) => {
      res.write(data);
    });
    response.on('end', () => {
      res.end();
    })

  }).on('error', (err) => {
    console.error('got this err: ' + err);
  });
});

mealRouter.get('/meals/breakfast', bodyParser, (req, res) => {
  https.get('https://data.seattle.gov/resource/47rs-c243.json?meal_served=Breakfast', (response) => {
    console.log('status code: ' + response.statusCode);
    console.log('headers: ' + response.headers);

    response.on('data', (data) => {
      res.write(data);
    });
    response.on('end', () => {
      res.end();
    })

  }).on('error', (err) => {
    console.error('got this err: ' + err);
  });
});

mealRouter.get('/meals/lunch', bodyParser, (req, res) => {
  https.get('https://data.seattle.gov/resource/47rs-c243.json?meal_served=Lunch', (response) => {
    console.log('status code: ' + response.statusCode);
    console.log('headers: ' + response.headers);

    response.on('data', (data) => {
      res.write(data);
    });
    response.on('end', () => {
      res.end();
    })

  }).on('error', (err) => {
    console.error('got this err: ' + err);
  });
});

mealRouter.get('/meals/dinner', bodyParser, (req, res) => {
  https.get('https://data.seattle.gov/resource/47rs-c243.json?meal_served=Dinner', (response) => {
    console.log('status code: ' + response.statusCode);
    console.log('headers: ' + response.headers);

    response.on('data', (data) => {
      res.write(data);
    });
    response.on('end', () => {
      res.end();
    })

  }).on('error', (err) => {
    console.error('got this err: ' + err);
  });
});