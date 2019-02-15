let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id, {
        code: 'document.body.style.backgroundColor = "' + color + '";'
      }
    );
  });
};

constructor() {
  // NOTE use action=parse to get html in content
  // setting rvprop=content reduces rate limit by 10 times
  this.endpoint = config.endpoint;
  this.action = '?action=query';
  this.props = {
    meta: '&prop=revisions&rvprop=ids|user|userid|flags|tags|timestamp|comment|user',
    content: '&prop=revisions&rvprop=content|ids|user|userid|flags|tags|timestamp|comment|user'
  };
  this.limit = {
    meta: '&rvlimit=max',
    content: '&rvlimit=5'
  };
  this.format = '&format=json&formatversion=2';
}

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
xhr.open("GET", chrome.extension.getURL('/config_resources/config.json'), true);
xhr.send();

getRevMeta(title) {
  // build request string, get meta
  const props = `${this.props.meta}${this.limit.meta}`;
  const req = `${this.endpoint}${this.action}&titles=${title.replace(/ /g, '%20')}${props}${this.format}`;
  console.log('Request:', req);

const endpoint = `https://${window.location.hostname}/w/api.php`;
const urlBase = `https://${window.location.hostname}/wiki/`;


//endpoint: 'https://en.wikipedia.org/w/api.php',
//urlBase: 'https://en.wikipedia.org/wiki/'
