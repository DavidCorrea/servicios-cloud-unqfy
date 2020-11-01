class UnqfyError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnqfyError";
  }
}

class ResourceNotFoundError extends UnqfyError {
  constructor(resourceName) {
    super(`${resourceName} does not exist`);
    this.name = "UnqfyError::ResourceNotFoundError";
  }
}

class BadRequestError extends UnqfyError {
  constructor() {
    super(`Bad request`);
    this.name = "UnqfyError::BadRequestError";
  }
}

class ResourceAlreadyExistError extends UnqfyError {
  constructor(resourceName) {
    super(`${resourceName} does already exist`);
    this.name = "UnqfyError::ResourceAlreadyExistError";
  }
}

module.exports = {
  UnqfyError,
  ResourceNotFoundError,
  BadRequestError,
  ResourceAlreadyExistError
};
