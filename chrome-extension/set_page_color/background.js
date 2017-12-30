const url = 'http://tce-extension.herokuapp.com'
// const url = 'http://localhost:8000'

var source = new window.EventSource(url + '/events');

source.addEventListener('message', function(e) {
  if (e.origin != url) {
    console.log('Origin was not' + url);
    return;
  }

  const obj = JSON.parse(e.data)

  chrome.browserAction.setBadgeText({text:String(obj.objInfo.players.length + obj.bcInfo.players.length)});
  chrome.storage.sync.set({ "yourBody": obj })
}, false);

source.addEventListener('open', function(e) {
  console.log('abriu')
  chrome.browserAction.setBadgeText({text:'open'});
}, false);

source.addEventListener('error', function(e) {
  if (e.eventPhase == 2) { //EventSource.CLOSED
    console.log('fechou')
  chrome.browserAction.setBadgeText({text:'closed'});
  }
}, false);