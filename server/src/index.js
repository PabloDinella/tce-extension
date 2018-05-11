let http = require('http');
let fs = require('fs');
const Gamedig = require('gamedig')

let objInfo = {}
let bcInfo = {}

setInterval(function() {
  Gamedig.query({
    type: 'wolfensteinet',
    host: '216.117.143.153',
    port: '27961',
  }).then((state) => {
    objInfo = state
  }).catch((error) => {
    objInfo = null
  }); 
  Gamedig.query({
    type: 'wolfensteinet',
    host: '216.117.143.153',
    port: '27960',
  }).then((state) => {
    bcInfo = state
  }).catch((error) => {
    bcInfo = null
  }); 
}, 5000)

http.createServer(function(req, res) {
  debugHeaders(req);
  
  console.log(req.headers.accept)

  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    if (req.url == '/events') {
      sendSSE(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(__dirname + '/index.html'));
    res.end();
  }
}).listen(process.env.PORT || 8000);

function sendSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': '*',
  });

  let id = (new Date()).toLocaleTimeString();

  let obj = JSON.stringify({objInfo, bcInfo})

  // Sends a SSE every 5 seconds on a single connection.
  setInterval(function() {
    obj = JSON.stringify({objInfo, bcInfo})
    constructSSE(res, id, obj);
  }, 5000);

  constructSSE(res, id, obj);
}

function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
}

function debugHeaders(req) {
  console.log('URL: ' + req.url);
  console.log('Check', req.url == '/events')
  for (let key in req.headers) {
    console.log(key + ': ' + req.headers[key]);
  }
  console.log('\n\n');
}
