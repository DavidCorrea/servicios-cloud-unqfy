const Monitor = require('./src/models/Monitor');
require('dotenv').config();
const express = require('express');
const { ResourceNotFoundError, RelatedResourceNotFoundError, ResourceAlreadyExistsError, BadRequestError } = require('./src/models/MonitorError');
const app = express(); 
const port = process.env.PORT || 3002;

const DELAY = 15000;
const monitor = new Monitor(DELAY);


// Body-parser (Para acceder al body en un POST/PUT/PATCH)
const bodyParser = require('body-parser');

// Routes + controllers
const MonitorRoute = require('./src/api/routes/monitor');

// MIDDLEWARES
app.use(bodyParser.json());
app.use(express.json());


app.use((req, res, next) => {
  req.monitor = monitor;
  next();
});

// ROUTES
app.use("/api", MonitorRoute);

app.use((error, req, res, next) => {
  console.log(error.message);

  if(error instanceof SyntaxError) {
    res.status(400).send({ status: 400, errorCode: 'BAD_REQUEST' });
  } else if(error instanceof BadRequestError) {
    res.status(400).send({ status: 400, errorCode: 'BAD_REQUEST' });
  } else if(error instanceof ResourceNotFoundError) {
    res.status(404).send({ status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
  } else if(error instanceof RelatedResourceNotFoundError) {
    res.status(404).send({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
  } else if(error instanceof ResourceAlreadyExistsError) {
    res.status(409).send({ status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
  } else {
    res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

app.use((req, res, next) => {
  res.status(404).send({ status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
});


app.listen(port, () => {
  console.log("Servidor corriendo!");
});


function main() {
  monitor.livenessChecks();
}

main();
