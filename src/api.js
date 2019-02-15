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

  getRevisionMeta(hostname, title, handler, rvcontinue) {
    this.hostname = hostname;
    this.url = {
      endpoint: `https://${this.hostname}/w/api.php`,
      base: `https://${this.hostname}/wiki/`,
    };
    const req = [
      this.url.endpoint,
      this.query.action,
      `&titles=${title.replace(/ /g, '%20')}`,
      this.query.request,
      this.query.limit,
      this.query.format,
      rvcontinue || ''
    ].join('');

    // log request
    console.log(req);
    
    // send to api
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handler;
    xhr.open('GET', req, true);
    xhr.send();
  }
}

export default API;
