class MonitorError extends Error {
  constructor(message) {
    super(message);
    this.name = "MonitorError";
  }
}

class ResourceNotFoundError extends MonitorError {
  constructor(resourceName) {
    super(`${resourceName} does not exist`);
    this.name = "MonitorError::ResourceNotFoundError";
  }
}

class BadRequestError extends MonitorError {
  constructor(message) {
    super(`Bad request: ${message}`);
    this.name = "MonitorError::BadRequestError";
  }

}

module.exports = {
  MonitorError: MonitorError,
  ResourceNotFoundError,
  BadRequestError
};
