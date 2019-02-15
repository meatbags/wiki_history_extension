/** Data visualiser. */

class View {
  constructor() {
    this.el = {
      header: document.querySelector('.header'),
      graph: document.querySelector('.graph'),
      calendar: document.querySelector('.calendar'),
    }
  }

  reset() {
    // clear everything
  }

  setTitle(title) {
    this.el.header.innerHTML = title;
  }

  parseRevisionData(data) {
    return new Promise((resolve, reject) => {
      const target = document.querySelector('.graph');
      const revisions = data.query.pages[0].revisions;
      revisions.forEach(rev => {
        const el = document.createElement('div');
        el.innerHTML = `${rev.user} - ${rev.timestamp}`;
        el.classList.add('item');
        target.appendChild(el);
      });
      resolve();
    });
  }
}

export default View;
