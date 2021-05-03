# Smart Medicine Cabinet

## Description

Course Design of the `Service Development Technology`.

## Installation

First please make sure you have installed `Node.JS` (v10.13.0 or higher).

```bash
$ git clone https://github.com/Grapedge/smart-medicine-cabinet.git
$ cd smart-medicine-cabinet
$ npm i
$ touch config.yaml
```

modify the `config.yaml`, this is an example:

```yaml
server:
  host: 127.0.0.1
  port: 8080
  openApiPath: /api # Swagger UI path
database: # MongoDB
  host: 127.0.0.1
  port: 27019
  user: smart-medicine-cabinet
  password: Your Mongo DB Password
  database: smart-medicine-cabinet
auth:
  issuer: smart-medicine-cabinet
  secret: HelloWorld
  accessTokenExpiresIn: 1d
  refreshTokenExpiresIn: 30d
```

Test the code:

```bash
$ npm run test
```

## Run

```bash
$ npm run start:dev # or start:prod in production mode
```
