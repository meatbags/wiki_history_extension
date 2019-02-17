/** Data visualiser. */

import Time from './time';

class View {
  constructor() {
    this.mouse = {x: 0, y: 0, ref: {x: 0, y: 0}, active: false};
    this.el = {
      title: document.querySelector('#title'),
      graphWrapper: document.querySelector('#graph-wrapper'),
      graphSlider: document.querySelector('#graph-slider'),
      graphWeekly: document.querySelector('#graph-weekly'),
      graphMonthly: document.querySelector('#graph-monthly'),
      togglePeriod: document.querySelector('#toggle-period'),
      info: document.querySelector('#graph-info'),
    };
    this.el.graphMonthly.classList.add('active');

    // storage
    this.dataset = [];
    this.maxVolume = {weekly: 0, monthly: 0};

    // add column for current week
    this.time = new Time();
    const weekStamp = this.time.getWeekStart().toISOString();
    const monthStamp = this.time.getMonthStart().toISOString();
    this.el.graphWeekly.appendChild(this.createColumn(weekStamp));
    this.el.graphMonthly.appendChild(this.createColumn(monthStamp));

    // ui
    this.el.graphSlider.addEventListener('mousedown', e => { this.onMouseDown(e); });
    this.el.graphSlider.addEventListener('mousemove', e => { this.onMouseMove(e); });
    this.el.graphSlider.addEventListener('mouseup', e => { this.onMouseUp(e); });
    this.el.graphSlider.addEventListener('mouseleave', e => { this.onMouseLeave(e); });
    this.el.togglePeriod.addEventListener('click', e => {
      this.el.togglePeriod.classList.toggle('active');
      this.el.graphWeekly.classList.toggle('active');
      this.el.graphMonthly.classList.toggle('active');
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
    const inner = document.createElement('div');
    el.classList.add('column');
    el.dataset.timestamp = timestamp;
    el.dataset.volume = 0;
    el.dataset.users = 0;
    el.dataset.usernames = '';
    inner.classList.add('column__inner');
    inner.style.height = '0%';
    el.appendChild(inner);
    return el;
  }

  addGraphData(graph, timestamp, data) {
    const el = graph.querySelector(`[data-timestamp="${timestamp}"]`);

    // check for unique user
    if (el.dataset.usernames.indexOf(data.user) == -1) {
      const usernames = el.dataset.usernames;
      el.dataset.usernames = usernames === '' ? data.user : `${usernames},${data.user}`;
      el.dataset.users = parseInt(el.dataset.users) + 1;
    }

    // increment volume
    const vol = parseInt(el.dataset.volume) + 1;
    el.dataset.volume = vol;
    return vol;
  }

  normaliseColumnHeight(el, maximum, index) {
    const percent = parseInt(el.dataset.volume) / maximum * 100;
    if (el.classList.contains('active')) {
      el.firstChild.style.height = `${percent}%`;
    } else {
      el.classList.add('active');
      setTimeout(() => {
        el.firstChild.style.height = `${percent}%`;
      }, index * 20);
    }
  }

  addMissingColumns(timestamp, type) {
    const graph = type == 'week' ? this.el.graphWeekly : this.el.graphMonthly;

    // get week/ month start date
    const lastChild = graph.lastChild;
    const date = type == 'week' ? this.time.getWeekStart(timestamp) : this.time.getMonthStart(timestamp);
    const stamp = date.toISOString();
    const a = date.getTime();
    const b = new Date(lastChild.dataset.timestamp).getTime();

    // add missing columns
    if (a < b) {
      const dates = type == 'week' ?
        this.time.getWeeks(stamp, lastChild.dataset.timestamp) :
        this.time.getMonths(stamp, lastChild.dataset.timestamp);

      // add columns if they don't exist
      for (let i=dates.length-1, lim=-1; i>lim; --i) {
        const str = dates[i].toISOString();
        if (!graph.querySelector(`[data-timestamp="${str}"]`)) {
          const el = this.createColumn(str);
          graph.appendChild(el);
        }
      }
    }
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
      // get week & month start
      const item = this.dataset[i];
      const weekStamp = this.time.getWeekStart(item.timestamp).toISOString();
      const monthStamp = this.time.getMonthStart(item.timestamp).toISOString();

      // add missing elements
      if (!this.el.graphWeekly.querySelector(`[data-timestamp="${weekStamp}"]`)) {
        this.addMissingColumns(weekStamp, 'week');
      }
      if (!this.el.graphMonthly.querySelector(`[data-timestamp="${monthStamp}"]`)) {
        this.addMissingColumns(monthStamp, 'month');
      }

      // increment and check max
      this.maxVolume.weekly = Math.max(this.maxVolume.weekly, this.addGraphData(this.el.graphWeekly, weekStamp, item));
      this.maxVolume.monthly = Math.max(this.maxVolume.monthly, this.addGraphData(this.el.graphMonthly, monthStamp, item));
    }

    // normalise data
    if (this.maxVolume.weekly != 0) {
      let i = 0;
      this.el.graphWeekly.querySelectorAll('.column').forEach(el => {
        this.normaliseColumnHeight(el, this.maxVolume.weekly, i++);
      });
    }
    if (this.maxVolume.monthly != 0) {
      let i = 0;
      this.el.graphMonthly.querySelectorAll('.column').forEach(el => {
        this.normaliseColumnHeight(el, this.maxVolume.monthly, i++);
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
    // move mouse
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    // calculate mouse delta and pan graph
    if (this.mouse.active) {
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

    // update information
    if (e.target && (e.target.classList.contains('column__inner') || e.target.classList.contains('column'))) {
      const target = e.target.classList.contains('column__inner') ? e.target.parentNode : e.target;
      const msg = `Edits: ${target.dataset.volume}<br />Users: ${target.dataset.users}`;
      this.el.info.innerHTML = msg;
      this.el.info.classList.add('active');
    } else {
      this.el.info.classList.remove('active');
    }

    // set information position
    const rect = this.el.graphSlider.getBoundingClientRect();
    let x = this.mouse.x - rect.left;
    let y = this.mouse.y - rect.top;
    x += (x <= rect.width - this.el.info.clientWidth * 2) ? 4 : -this.el.info.clientWidth - 4;
    y += (y <= rect.height - this.el.info.clientHeight * 2) ? 4 : -this.el.info.clientHeight - 4;
    this.el.info.style.left = `${x}px`;
    this.el.info.style.top = `${y}px`;
  }

  onMouseUp(e) {
    this.mouse.active = false;
  }

  onMouseLeave() {
    this.mouse.active = false;
    this.el.info.classList.remove('active');
  }

  setTitle(title) {
    this.el.title.innerHTML = title;
  }
}

export default View;
