// A server that proxies requests to downstream servers depending on the
// request path.

var http = require('http'),
    sys  = require('sys');

var mappingDefaults = {
  host: 'localhost',
  port: '80'
};

var resolveDownstream = function(mappings, host, path) {
  for (var i = 0; i < mappings.length; i++) {
    var m = mappings[i];
    if ((m.matchHost === null || (host || '').match(m.matchHost)) &&
        (m.matchPath === null || path.match(m.matchPath))) {
      return {
        host: m.host || mappingDefaults.host,
        port: m.port || mappingDefaults.port
      };
    }
  }
  return null;
};

exports.run = function(mappings, listenPort){
  var server = function(request, response) {
    var host;
    if (request.headers.host) {
      host = request.headers.host.split(':')[0];
    }

    var downstream = resolveDownstream(mappings, host, request.url);

    var log = function(statusCode){
      sys.log(
        statusCode + ' ' +
        (downstream ? downstream.host + ':' + downstream.port : '') +
        request.url
      );
    };

    if (downstream === null) {
      log(401);
      response.writeHead(401);
      response.end();
      return;
    }

    var downstreamClient = http.createClient(downstream.port, downstream.host);

    downstreamClient.on('error', function(err){
      log(500);
      response.writeHead(500);
      response.end();
    });

    request.headers.host = downstream.host;
    var downstreamRequest = downstreamClient.request(request.method, request.url, request.headers);

    downstreamRequest.on('response', function(downstreamResponse) {
      log(downstreamResponse.statusCode);

      response.writeHead(
        downstreamResponse.statusCode,
        downstreamResponse.headers
      );

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

  http.createServer(server).listen(listenPort);
};
