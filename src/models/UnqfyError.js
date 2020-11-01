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

class ResourceAlreadyExistsError extends UnqfyError {
  constructor(resourceName, resourceField) {
    super(`Couldn't create new ${resourceName}: ${resourceField} was already taken`);
    this.name = "UnqfyError::ResourceAlreadyExistsError";
  }
}

module.exports = {
  UnqfyError,
  ResourceNotFoundError,
  ResourceAlreadyExistsError
};
