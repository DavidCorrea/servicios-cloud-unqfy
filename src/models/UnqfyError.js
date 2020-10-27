class UnqfyError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnqfyError";
  }
}

module.exports = UnqfyError;
