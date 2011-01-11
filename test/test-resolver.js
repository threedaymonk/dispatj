var common = require('./common');
var resolver = require('dispatj/resolver');

var mockRequest = function(){
  return {
    headers: {host: 'example.com:8080'},
    url: '/foo/bar',
    method: 'GET'
  };
};

exports['default should match anything and return default host and port'] = function(test){
  var mappings = [{}];
  var request = mockRequest();

  resolver.resolve(mappings, request, function(result){
    test.equals(result.host, 'localhost');
    test.equals(result.port, 80);
    test.done();
  });
};

exports['default should match any host when host is missing'] = function(test){
  var mappings = [{}];
  var request = mockRequest();
  request.headers.host = null;

  resolver.resolve(mappings, request, function(result){
    test.equals(result.host, 'localhost');
    test.equals(result.port, 80);
    test.done();
  });
};

exports['should match by host'] = function(test){
  var mappings = [
    {
      matchHost: /^a\.example\.com$/,
      host: '10.0.0.100',
      port: 100
    },
    {
      matchHost: /^b\.example\.com$/,
      host: '10.0.0.101',
      port: 101
    }
  ];
  var request = mockRequest();
  request.headers.host = 'b.example.com:8080';

  resolver.resolve(mappings, request, function(result){
    test.equals(result.host, '10.0.0.101');
    test.equals(result.port, 101);
    test.done();
  });
};

exports['should match by path'] = function(test){
  var mappings = [
    {
      matchPath: '^/foo',
      host: '10.0.0.100',
      port: 100
    },
    {
      matchPath: '^/bar',
      host: '10.0.0.101',
      port: 101
    }
  ];
  var request = mockRequest();
  request.url = '/bar/x?a=1';

  resolver.resolve(mappings, request, function(result){
    test.equals(result.host, '10.0.0.101');
    test.equals(result.port, 101);
    test.done();
  });
};

exports['should pass headers through'] = function(test){
  var mappings = [{}];
  var request = mockRequest();
  request.headers.arbitrary = 'whatever';

  resolver.resolve(mappings, request, function(result){
    test.equals(result.headers.arbitrary, 'whatever');
    test.done();
  });
};

exports['should pass path through'] = function(test){
  var mappings = [{}];
  var request = mockRequest();
  request.url = '/a/b?x=y';

  resolver.resolve(mappings, request, function(result){
    test.equals(result.url, '/a/b?x=y');
    test.done();
  });
};
