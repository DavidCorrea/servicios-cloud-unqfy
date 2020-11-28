const express = require('express');
const router = express.Router();
const { BadRequestError } = require('../../models/UnqfyError');

const validateValueFromRequestExists = (value, field) => {
  if (!value) {
    throw new BadRequestError(`'${field}' must be present`);
  }
}

router.post('/', async (req, res, next) => {
  const unqfy = req.unqfy;
  const { name } = req.body;

  try {
    validateValueFromRequestExists(name, 'name');
    const createdUser = unqfy.createUser(name);

    res.status(201).send(createdUser);
  } catch(error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const unqfy = req.unqfy;
  const { id } = req.params;

  try {
    const user = unqfy.getUserById(Number(id));

    res.status(200).send(user);
  } catch(error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const unqfy = req.unqfy;
  const { id } = req.params;
  const { name } = req.body;

  try {
    validateValueFromRequestExists(name, 'name');
    const user = unqfy.updateUserName(Number(id), name);

    res.status(200).send(user);
  } catch(error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const unqfy = req.unqfy;
  const { id } = req.params;

  try {
    unqfy.removeUser(Number(id));

    res.status(204).send();
  } catch(error) {
    next(error);
  }
});

router.post('/:id/reproductions', async (req, res, next) => {
  const unqfy = req.unqfy;
  const { id } = req.params;
  const { track } = req.body;

  try {
    validateValueFromRequestExists(track, 'track');
    unqfy.userListenToByIds(Number(id), Number(track));

    res.status(201).send();
  } catch(error) {
    next(error);
  }
});

module.exports = router;
