const paths = require('./path');
const definitions = require('./definitions');

let host = 'localhost:' + process.env.PORT

if (process.env.NODE_ENV != 'development') {
  host = process.env.HOST;
}

//Swagger File Configuration
module.exports = {

  "swagger": "2.0",
  "info": {
    "title": "My Application",
    "version": "1.0.0"
  },
  "host": host,
  "basePath": "/api/v1",
  "paths": paths,
  "definitions": definitions,
  "responses": {},
  "parameters": {},
  "securityDefinitions": {},
  "tags": []
}
