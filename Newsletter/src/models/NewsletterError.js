class NewsletterError extends Error {
  constructor(message) {
    super(message);
    this.name = "NewsletterError";
  }
}

class ResourceNotFoundError extends NewsletterError {
  constructor(resourceName) {
    super(`${resourceName} does not exist`);
    this.name = "NewsletterError::ResourceNotFoundError";
  }
}

class ResourceAlreadyExistsError extends NewsletterError {
  constructor(resourceName, resourceField) {
    super(`Couldn't create new ${resourceName}: ${resourceField} was already used`);
    this.name = "NewsletterError::ResourceAlreadyExistsError";
  }
}

class RelatedResourceNotFoundError extends NewsletterError {
  constructor(resourceName) {
    super(`${resourceName} does not exist`);
    this.name = "NewsletterError::RelatedResourceNotFoundError";
  }
}

class BadRequestError extends NewsletterError {
  constructor(message) {
    super(`Bad request: ${message}`);
    this.name = "NewsletterError::BadRequestError";
  }

}

module.exports = {
  NewsletterError,
  ResourceNotFoundError,
  RelatedResourceNotFoundError,
  ResourceAlreadyExistsError,
  BadRequestError
};
