exports.resolve = function(mappings, req, onResolution){
  var host = (req.headers.host || '').split(':')[0];

  for (var i = 0, ii = mappings.length; i < ii; i++) {
    var m = mappings[i];
    if (host.match(m.matchHost) && req.url.match(m.matchPath)) {
      req.headers.host = m.host || 'localhost';
      onResolution({
        host: req.headers.host,
        port: m.port || 80,
        method: req.method,
        url: req.url,
        headers: req.headers
      });
      return;
    }
  }
  onResolution(null);
};
