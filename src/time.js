/** Time utilities. */

class Time {
  constructor() {
    this.date = new Date();
  }

  getWeekStart(timestamp) {
    // get start of week as Date object
    const d = new Date(timestamp || this.date);
    const date = d.getUTCDate();
    const day = d.getUTCDay();
    const res = new Date(d);
    res.setUTCDate(date - ((day + 6) % 7));
    res.setUTCHours(0, 0, 0, 0);
    return res;
  }

  getWeeks(from, to) {
    // get array of week starts (Date objects)
    const start = this.getWeekStart(from);
    const stop = this.getWeekStart(to);
    let current = new Date(start);
    const res = [start];
    while (current.getTime() < stop.getTime()) {
      current.setUTCDate(current.getUTCDate() + 7);
      res.push(new Date(current));
    }
    res.push(stop);
    return res;
  }
}

export default Time;
