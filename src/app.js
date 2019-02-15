/** Application entry point. */

import API from './api';
import View from './view';

class App {
  constructor() {
    this.api = new API();
    this.view = new View();
    this.getData();

    // manual
    const button = document.querySelector('#refresh');
    if (button) {
      button.addEventListener('click', () => {
        this.view.reset();
      })
    }
  }

  getData() {
    if (!this.locked) {
      this.locked = true;
      chrome.storage.sync.get(null, res => {
        if (res.title && res.hostname) {
          // log
          this.view.setTitle(res.title);

          // get api data
          this.api.getRevisionMeta(res.hostname, res.title, evt => {
            this.handleRevisionData(evt);
          });
        } else {
          this.locked = false;
        }
      });
    }
  }

  handleRevisionData(evt) {
    if (evt.currentTarget && evt.currentTarget.readyState == 4) {
      const responseText = evt.currentTarget.responseText;
      const json = JSON.parse(responseText);
      this.view.parseRevisionData(json).then(() => {
        if (json.continue && json.continue.rvcontinue) {
          console.log(json.continue);
        }
      });
    } else {
      console.log('Request failed:', evt);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});
