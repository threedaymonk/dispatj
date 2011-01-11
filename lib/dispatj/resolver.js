var async = require('async'),
    _ = require('underscore');

exports.resolve = function(mappings, req, onResolution){
  var host = (req.headers.host || '').split(':')[0];

  async.detectSeries(mappings, function(m, callback){
    callback(host.match(m.matchHost) && req.url.match(m.matchPath));
  }, function(m){
    if (m) {
      var headers = _.clone(req.headers);
      headers.host = m.host || 'localhost';
      onResolution({
        host: headers.host,
        port: m.port || 80,
        method: req.method,
        url: req.url,
        headers: headers
      });
    } else {
      onResolution(null);
    }
  });
};
