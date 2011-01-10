var merge = function(a, b){
  var f = function(){};
  f.prototype = a;
  var c = new f();
  for (var k in b) { if (b.hasOwnProperty(k)) {
    c[k] = b[k];
  }}
  return c;
};

var defaultMappings = {
  matchHost: '',
  matchPath: '',
  host: 'localhost',
  port: 80
};

exports.resolve = function(mappings, request){
  var host = (request.headers.host || '').split(':')[0];
  var downstream = null;

  for (var i = 0; i < mappings.length; i++) {
    var m = merge(defaultMappings, mappings[i]);
    if (host.match(m.matchHost) && request.url.match(m.matchPath)) {
      downstream = {host: m.host, port: m.port};
      break;
    }
  }

  if (downstream === null) { return null; }

  return {
    host: downstream.host,
    port: downstream.port,
    method: request.method,
    url: request.url,
    headers: merge(request.headers, {host: downstream.host})
  };
};
