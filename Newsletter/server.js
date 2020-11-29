require('dotenv').config();
const express = require('express');
const { NewsletterError, ResourceNotFoundError, RelatedResourceNotFoundError, ResourceAlreadyExistsError, BadRequestError } = require('./src/models/NewsletterError');
const app = express(); 
const port = process.env.PORT || 3001;


// Body-parser (Para acceder al body en un POST/PUT/PATCH)
const bodyParser = require('body-parser');

// Routes + controllers
const NewsletterRoute = require('./src/api/routes/newsletter');

// MIDDLEWARES
app.use(bodyParser.json()); // parse application/json
app.use(express.json());

// ROUTES
app.use("/api", NewsletterRoute);

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
