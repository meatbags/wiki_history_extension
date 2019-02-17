/** Data visualiser. */

import Time from './time';

class View {
  constructor() {
    this.mouse = {x: 0, y: 0, ref: {x: 0, y: 0}, active: false};
    this.el = {
      title: document.querySelector('#title'),
      graphWrapper: document.querySelector('#graph-wrapper'),
      graphSlider: document.querySelector('#graph-slider'),
      graph: document.querySelector('#graph'),
      togglePeriod: document.querySelector('#toggle-period'),
    };

    // storage
    this.dataset = [];
    this.maxVolume = 0;

    // add column for current week
    this.time = new Time();
    const monday = this.time.getWeekStart().toISOString();
    const el = this.createColumn(monday);
    this.el.graph.appendChild(el);

    // ui
    this.el.graph.addEventListener('mousedown', e => { this.onMouseDown(e); });
    this.el.graph.addEventListener('mousemove', e => { this.onMouseMove(e); });
    this.el.graph.addEventListener('mouseup', e => { this.onMouseUp(e); });
    this.el.graph.addEventListener('mouseleave', e => { this.onMouseUp(e); });
    this.el.togglePeriod.addEventListener('click', e => {
      this.el.togglePeriod.classList.toggle('active');
    });
  }

  parseRevisionData(data) {
    return new Promise((resolve, reject) => {
      this.addRevisions(data.query.pages[0].revisions);
      resolve();
    });
  }

  createColumn(timestamp) {
    const el = document.createElement('div');
    el.classList.add('column');
    el.dataset.timestamp = timestamp;
    el.dataset.volume = 0;
    el.style.height = '0%';
    return el;
  }

  addMissingColumns(timestamp) {
    // add missing weeks
    const lastChild = this.el.graph.lastChild;
    const weekStart = this.time.getWeekStart(timestamp);
    const a = weekStart.getTime();
    const b = new Date(lastChild.dataset.timestamp).getTime();
    if (a < b) {
      const dates = this.time.getWeeks(weekStart.toISOString(), lastChild.dataset.timestamp);

      // add columns
      for (let i=dates.length-1, lim=-1; i>lim; --i) {
        const str = dates[i].toISOString();

        // add element if it doesn't exist
        if (!this.el.graph.querySelector(`[data-timestamp="${str}"]`)) {
          const el = this.createColumn(str);
          this.el.graph.appendChild(el);
        }
      }
    }
  }

  incrementColumn(timestamp) {
    const el = this.el.graph.querySelector(`[data-timestamp="${timestamp}"]`);
    const val = parseInt(el.dataset.volume) + 1;
    el.dataset.volume = val;
    el.title = `${val}`;
    return val;
  }

  addRevisions(revs) {
    // store new data
    const index = this.dataset.length;
    this.dataset = this.dataset.concat(revs.map(el => {
      return {
        timestamp: el.timestamp,
        user: el.user,
      };
    }))

    // parse new data
    for (let i=index, len=this.dataset.length; i<len; ++i) {
      // get week start
      const item = this.dataset[i];
      const str = this.time.getWeekStart(item.timestamp).toISOString();

      // add missing elements
      if (!this.el.graph.querySelector(`[data-timestamp="${str}"]`)) {
        this.addMissingColumns(str);
      }

      // increment and check max
      this.maxVolume = Math.max(this.maxVolume, this.incrementColumn(str));
    }

    // normalise data
    if (this.maxVolume != 0) {
      let i = 0;
      this.el.graph.querySelectorAll('.column').forEach(el => {
        const percent = parseInt(el.dataset.volume) / this.maxVolume * 100;
        if (el.classList.contains('active')) {
          el.style.height = `${percent}%`;
        } else {
          el.classList.add('active');
          setTimeout(() => {
            el.style.height = `${percent}%`;
          }, i++ * 20);
        }
      });
    }
  }

  onMouseDown(e) {
    this.mouse.active = true;

    // set start positions
    this.mouse.ref.x = e.clientX;
    this.mouse.ref.y = e.clientY;
    this.scrollRef = this.el.graphSlider.scrollLeft;
    this.scrollMax = this.el.graphSlider.scrollWidth - this.el.graphSlider.clientWidth;
  }

  onMouseMove(e) {
    // calculate mouse delta and pan graph
    if (this.mouse.active) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      const dx = this.mouse.x - this.mouse.ref.x;
      let next = this.scrollRef - dx;

      // limit scrolling & reset delta origin
      if (next > this.scrollMax || next < 0) {
        next = Math.max(0, Math.min(this.scrollMax, next));
        this.mouse.ref.x = this.mouse.x;
        this.scrollRef = next;
      }

      // set new scroll
      this.el.graphSlider.scrollLeft = next;
    }
  }

  onMouseUp(e) {
    this.mouse.active = false;
  }

  setTitle(title) {
    this.el.title.innerHTML = title;
  }
}

export default View;
