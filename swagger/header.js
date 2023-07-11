module.exports = {
  "token": {
    "name": "token",
    "description": "Api token",
    "in": "header",
    "required": true,
    "value": "ab8c1f1dccb2648d195952a3cd96109c00e726b39a82915ccbe2a36feb852c66",
    "type": "string"
  },
  "nonce": {
    "name": "nonce",
    "description": "random number used to generate token",
    "in": "header",
    "required": true,
    "value": "NBdYPcaSqY",
    "type": "string"
  },
  "timestamp": {
    "name": "timestamp",
    "description": "timestamp used to generate token",
    "in": "header",
    "required": true,
    "value": "1642058000",
    "type": "string"
  },
  "access_key": {
    "name": "access_key",
    "description": "access_key used to generate token after login",
    "in": "header",
    "required": true,
    "type": "string"
  }
}
