require('dotenv').config();
const express = require('express');
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


app.listen(port, () => {
  console.log("Servidor corriendo!");
});
