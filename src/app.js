/** Application entry point. */

import API from './api';
import View from './view';

class App {
  constructor() {
    this.api = new API();
    this.view = new View();
    this.checkStorage();

    // manual refresh
    const button = document.querySelector('#refresh');
    if (button) {
      button.addEventListener('click', () => {
        // this.view.reset();
      })
    }
  }

  checkStorage() {
    chrome.storage.sync.get(null, res => {
      if (res.title && res.hostname) {
        this.api.init(res.title, res.hostname);
        this.view.setTitle(res.title);
        this.api.getRevisionMeta(evt => { this.onRevisionMeta(evt); }, false);
      } else {
        // get data from storage
      }
    });
  }

  onRevisionMeta(evt) {
    if (evt.currentTarget && evt.currentTarget.readyState == 4) {
      // parse data and continue
      const res = JSON.parse(evt.currentTarget.responseText);
      this.view.parseRevisionData(res).then(() => {
        if (res.continue && res.continue.rvcontinue) {
          console.log(res.continue);
        }
      });
    } else {
      console.log('Ready state:', evt.currentTarget.readyState);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});
