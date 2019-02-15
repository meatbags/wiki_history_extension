/** Send page title to extension. */

const el = document.querySelector('#firstHeading');

if (el) {
  const title = el.textContent;
  const hostname = window.location.hostname;
  chrome.storage.sync.set({title: title, hostname: hostname}, () => {
    console.log('Stored title and host.');
  });
} else {
  console.log('Title not found.');
}
