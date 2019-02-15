/** Call the wikipedia API. */

class API {
  constructor() {
    this.query = {
      action: '?action=query',
      request: '&prop=revisions&rvprop=ids|user|userid|flags|tags|timestamp',
      limit: '&rvlimit=max',
      format: '&format=json&formatversion=2',
    };
  }

  init(title, hostname) {
    this.title = title;
    this.hostname = hostname;
    this.endpoint = `https://${this.hostname}/w/api.php`;

    // build request string
    this.requestString = [
      this.endpoint,
      this.query.action,
      `&titles=${this.title.replace(/ /g, '%20')}`,
      this.query.request,
      this.query.limit,
      this.query.format
    ].join('');
  }

  getRevisionMeta(handler, rvcontinue) {
    const req = this.requestString + (rvcontinue ? `&rvcontinue=${rvcontinue}` : '');
    const xhr = new XMLHttpRequest();

    // log request
    console.log(req);

    // send to api
    xhr.onreadystatechange = handler;
    xhr.open('GET', req, true);
    xhr.send();
  }
}

export default API;
