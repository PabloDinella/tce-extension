var http = require('http');
var fs = require('fs');

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

  var id = (new Date()).toLocaleTimeString();

  // Sends a SSE every 5 seconds on a single connection.
  setInterval(function() {
    constructSSE(res, id, (new Date()).toLocaleTimeString());
  }, 5000);

  constructSSE(res, id, (new Date()).toLocaleTimeString());
}

function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
}

function debugHeaders(req) {
  console.log('URL: ' + req.url);
  console.log('Check', req.url == '/events')
  for (var key in req.headers) {
    console.log(key + ': ' + req.headers[key]);
  }
  console.log('\n\n');
}
