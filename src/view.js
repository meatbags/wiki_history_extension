/** Data visualiser. */

class View {
  constructor() {}

  reset() {
    // clear everything
  }

  setTitle(title) {
    document.querySelector('.wrapper-header').innerHTML = title;
  }

  parseRevisionData(data) {
    return new Promise((resolve, reject) => {
      const target = document.querySelector('.wrapper-content');
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
