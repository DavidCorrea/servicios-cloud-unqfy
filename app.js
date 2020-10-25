require('dotenv').config();
const express = require('express');
const app = express(); 

const port = process.env.PORT || 3000;

// Body-parser (Para acceder al body en un POST/PUT/PATCH)
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // parse application/json

app.listen(port, () => {
    console.log("Servidor corriendo!");
});