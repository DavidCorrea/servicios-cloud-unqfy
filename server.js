require('dotenv').config();
const express = require('express');
const app = express(); 
const UNQfyLoader = require('./src/lib/UNQfyLoader');
const port = process.env.PORT || 3000;

const { 
  ResourceNotFoundError,
  RelatedResourceNotFoundError,
  ResourceAlreadyExistsError, 
  BadRequestError 
} = require('./src/models/UnqfyError');

// Body-parser (Para acceder al body en un POST/PUT/PATCH)
const bodyParser = require('body-parser');

// Routes + controllers
const ArtistsRoute = require('./src/api/routes/Artists');
const AlbumsRoute = require('./src/api/routes/Albums');
const TracksRoute = require('./src/api/routes/Tracks');
const PlaylistsRoute = require('./src/api/routes/Playlists');

// MIDDLEWARES
app.use(bodyParser.json()); // parse application/json
app.use(express.json());

app.use((req, res, next) => {
  const shouldSaveUnqfy = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);
  const originalSend = res.send;
  req.unqfy = UNQfyLoader.getUNQfy();

  res.send = function() {
    if(shouldSaveUnqfy) {
      UNQfyLoader.saveUNQfy(req.unqfy);
    }
    
    originalSend.apply(res, arguments);
  };

  next();
});

// ROUTES
app.use("/api/artists", ArtistsRoute);
app.use("/api/albums", AlbumsRoute);
app.use("/api/tracks", TracksRoute);
app.use("/api/playlists", PlaylistsRoute);

app.use((error, req, res, next) => {
  if(error instanceof BadRequestError) {
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
