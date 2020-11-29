class Observable {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  async _notify(data) {
    for (const observer of this.observers) {
      await observer.update(this, data);
    }
  }
}

module.exports = Observable;
