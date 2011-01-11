var async = require('async');

var clone = function(a){
  var f = function(){};
  f.prototype = a;
  return new f();
};

exports.resolve = function(mappings, request, onResolution){
  var host = (request.headers.host || '').split(':')[0];

  async.detectSeries(mappings, function(m, callback){
    callback(host.match(m.matchHost) && request.url.match(m.matchPath));
  }, function(m){
    if (m === undefined) {
      onResolution(null);
    } else {
      var headers = clone(request.headers);
      headers.host = m.host || 'localhost';
      onResolution({
        host: headers.host,
        port: m.port || 80,
        method: request.method,
        url: request.url,
        headers: headers
      });
    }
  });
};
