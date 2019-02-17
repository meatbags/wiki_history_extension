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
    d.setUTCDate(date - ((day + 6) % 7));
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  getMonthStart(timestamp) {
    // get start of month as Date object
    const d = new Date(timestamp || this.date);
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    return d;
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

  getMonths(from, to) {
    // get array of month starts (Date objects)
    const start = this.getMonthStart(from);
    const stop = this.getMonthStart(to);
    let current = new Date(start);
    const res = [start];
    while (current.getTime() < stop.getTime()) {
      current.setUTCMonth(current.getUTCMonth() - 1);
      res.push(new Date(current));
    }
    res.push(stop);
    return res;
  }
}

export default Time;
