/** Application entry point. */
import API from './api';

class App {
  constructor() {
    this.api = new API();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});
