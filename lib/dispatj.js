var resolver = require('./dispatj/resolver'),
    http = require('http');

exports.run = function(mappings, listenPort, logger){
  var handler = function(usReq, usRes) {
    resolver.resolve(mappings, usReq, function(ds){
      var log = function(statusCode){
        if (logger) {
          logger(
            statusCode + ' ' +
            (ds ? ds.host + ':' + ds.port : '') +
            usReq.url
          );
        }
      };

      if (ds === null) {
        log(401);
        usRes.writeHead(401);
        usRes.end();
        return;
      }

      var dsClient = http.createClient(ds.port, ds.host);

      dsClient.on('error', function(err){
        log(500);
        usRes.writeHead(500);
        usRes.end();
      });

      var dsReq = dsClient.request(ds.method, ds.url, ds.headers);

      dsReq.on('response', function(dsRes) {
        log(dsRes.statusCode);
        usRes.writeHead(dsRes.statusCode, dsRes.headers);

        dsRes.on('data', function(chunk) { usRes.write(chunk, 'binary'); });
        dsRes.on('end', function() { usRes.end(); });
      });

      usReq.on('data', function(chunk) { dsReq.write(chunk, 'binary'); });
      usReq.on('end', function() { dsReq.end(); });
    });
  };

  var server = http.createServer(handler);
  server.listen(listenPort);
  return server;
};
