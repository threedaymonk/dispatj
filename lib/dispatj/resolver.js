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

var extractHostname = function(host){
  if (host) {
    return host.split(':')[0];
  } else {
    return null;
  }
};

var clone = function(o){
  var f = function(){};
  f.prototype = o;
  return new f();
};

exports.resolve = function(mappings, request){
  var host = extractHostname(request.headers.host);
  var downstream = resolveDownstream(mappings, host, request.url);

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
