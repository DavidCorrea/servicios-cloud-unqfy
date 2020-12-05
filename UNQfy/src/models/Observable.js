class Observable {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  _notify(data) {
    this.observers.forEach(observer => observer.update(this, data));
  }
}

module.exports = Observable;
