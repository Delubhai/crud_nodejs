const header = require('./header');

module.exports = {
  //signup
  "/auth/signup": {
    "post": {
      "tags": ["Authentication"],
      "description": "Create new user in system",
      "parameters": [
        header.token,
        header.nonce,
        header.timestamp,
        header.access_key,
        {
          "name": "user",
          "in": "body",
          "description": "User that we want to create",
          "schema": {
            "$ref": "#/definitions/register"
          }
        }
      ],
      "produces": ["application/json"],
      "responses": {
        "200": {
          "description": "New user is created",
          "schema": {
            "$ref": "#/definitions/success"
          }
        },
        "400": {
          "description": "error",
          "schema": {
            "$ref": "#/definitions/error"
          }
        }
      }
    }
  }
}
