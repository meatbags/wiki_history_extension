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
        // TODO: reset everything
      });
    }
  }

  checkStorage() {
    // check local session storage or request new data
    chrome.storage.sync.get(null, res => {
      if (res.title && res.hostname) {
        // init view
        this.view.setTitle(res.title);
        this.api.init(res.title, res.hostname);

        // check session for existing data
        if (res.title === localStorage.getItem('title') && res.hostname === localStorage.getItem('hostname')) {
          // process localstorage here
        } else {
          this.api.getRevisionMeta(evt => {
            this.onRevisionMeta(evt);
          }, false);
        }
      }
    });
  }

  onRevisionMeta(evt) {
    if (evt.currentTarget && evt.currentTarget.readyState == 4) {
      // parse data and continue
      const res = JSON.parse(evt.currentTarget.responseText);
      this.view.parseRevisionData(res).then(() => {
        // continue until complete
        if (res.continue && res.continue.rvcontinue) {
          this.api.getRevisionMeta(evt => {
            this.onRevisionMeta(evt);
          }, res.continue.rvcontinue);
        }
      });
    } else {
      console.log('Ready state:', evt.currentTarget.readyState);
    }
  }

  storeSessionData() {
    const revisions = localStorage.getItem('revisions');
    if (revisions) {
      // concat
    } else {
      // new data
    }
  }

  clearSessionData() {
    localStorage.removeItem('title');
    localStorage.removeItem('hostname');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});
