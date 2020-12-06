require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3003;

// Routes + controllers
const LoggingRoute = require('./src/api/routes/logging');

// Middlewares
app.use(express.json());

// ROUTES
app.use("/api", LoggingRoute);

app.use((error, req, res, next) => {
  console.log(error.message);

  res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
});

app.use((req, res, next) => {
  res.status(404).send({ status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
});


app.listen(port, () => {
  console.log("Servidor corriendo!");
});
