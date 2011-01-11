var async = require('async');

exports.resolve = function(mappings, req, onResolution){
  var host = (req.headers.host || '').split(':')[0];

  async.detectSeries(mappings, function(m, callback){
    callback(host.match(m.matchHost) && req.url.match(m.matchPath));
  }, function(m){
    if (m === undefined) {
      onResolution(null);
    } else {
      var headers = {};
      for (var k in req.headers) { if (req.headers.hasOwnProperty(k)) {
        headers[k] = req.headers[k];
      }}
      headers.host = m.host || 'localhost';
      onResolution({
        host: headers.host,
        port: m.port || 80,
        method: req.method,
        url: req.url,
        headers: headers
      });
    }
  });
};
