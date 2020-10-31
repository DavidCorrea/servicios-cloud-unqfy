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

module.exports = {
  UnqfyError,
  ResourceNotFoundError
};
