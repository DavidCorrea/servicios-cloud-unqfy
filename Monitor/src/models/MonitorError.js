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

class ResourceAlreadyExistsError extends MonitorError {
  constructor(resourceName, resourceField) {
    super(`Couldn't create new ${resourceName}: ${resourceField} was already used`);
    this.name = "MonitorError::ResourceAlreadyExistsError";
  }
}

class RelatedResourceNotFoundError extends MonitorError {
  constructor(resourceName) {
    super(`${resourceName} does not exist`);
    this.name = "MonitorError::RelatedResourceNotFoundError";
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
  RelatedResourceNotFoundError,
  ResourceAlreadyExistsError,
  BadRequestError
};
