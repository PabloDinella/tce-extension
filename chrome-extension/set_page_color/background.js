var source = new window.EventSource('http://localhost:8000/events');

source.addEventListener('message', function(e) {
  if (e.origin != 'http://localhost:8000') {
    alert('Origin was not http://localhost:8000');
    return;
  }

  console.log('lastEventID: ' + (e.lastEventId || '--') +
             ', server time: ' + e.data, 'msg');
  chrome.browserAction.setBadgeText({text:String(e.data)});
  chrome.storage.sync.set({ "yourBody": e.data })
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