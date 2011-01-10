var clone = function(o){
  var f = function(){};
  f.prototype = o;
  return new f();
};

exports.resolve = function(mappings, request){
  var host = (request.headers.host || '').split(':')[0];
  var downstream;

  for (var i = 0; i < mappings.length; i++) {
    var m = mappings[i];
    if (host.match(m.matchHost || '') && request.url.match(m.matchPath || '')) {
      downstream = {
        host: m.host || 'localhost',
        port: m.port || 80
      };
      break;
    }
  }

  if (downstream === null) {
    return null;
  }

  var headers = clone(request.headers);
  headers.host = downstream.host;

  return {
    host: downstream.host,
    port: downstream.port,
    method: request.method,
    url: request.url,
    headers: headers
  };
};
