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

class RelatedResourceNotFoundError extends UnqfyError {
  constructor(resourceName) {
    super(`${resourceName} does not exist`);
    this.name = "UnqfyError::RelatedResourceNotFoundError";
  }
}

class BadRequestError extends UnqfyError {
  constructor(message) {
    super(`Bad request: ${message}`);
    this.name = "UnqfyError::BadRequestError";
  }

}

module.exports = {
  UnqfyError,
  ResourceNotFoundError,
  RelatedResourceNotFoundError,
  ResourceAlreadyExistsError,
  BadRequestError
};
