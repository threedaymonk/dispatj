// A front-end that proxies requests to downstream servers depending on the
// request path.

var http = require('http'),
    sys  = require('sys');

// Example:
//
// var mappings = [
//   [/^\/foo/, 'host1',    80],
//   [/^\/bar/, 'host2',  1234]
// ];

var mappings = [];

var resolveDownstream = function(path) {
  var i, ii = mappings.length;
  for (i = 0; i < ii; i++) {
    if (path.match(mappings[i][0])) {
      return {
        host: mappings[i][1],
        port: mappings[i][2]
      };
    }
  }
  return null;
};

var server = function(request, response) {
  var downstream = resolveDownstream(request.url);

  if (downstream == null) {
    sys.log('401 ' + request.url);
    response.writeHead(401);
    response.end();
    return;
  }

  request.headers.host = downstream.host;

  var downstreamRequest =
    http.createClient(downstream.port, downstream.host).
    request(request.method, request.url, request.headers);

  downstreamRequest.on('response', function(downstreamResponse) {
    sys.log(downstreamResponse.statusCode + ' ' + downstream.host + ':' + downstream.port + request.url);

    response.writeHead(downstreamResponse.statusCode, downstreamResponse.headers);
    downstreamResponse.on('data', function(chunk) {
      response.write(chunk, 'binary');
    });
    downstreamResponse.on('end', function() {
      response.end();
    });
  });

  request.on('data', function(chunk) {
    downstreamRequest.write(chunk, 'binary');
  });

  request.on('end', function() {
    downstreamRequest.end();
  });
};

http.createServer(server).listen(8080);
