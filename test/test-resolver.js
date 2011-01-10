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

  var result = resolver.resolve(mappings, request);

  test.equals(result.host, 'localhost');
  test.equals(result.port, 80);
  test.done();
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

  var result = resolver.resolve(mappings, request);

  test.equals(result.host, '10.0.0.101');
  test.equals(result.port, 101);
  test.done();
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

  var result = resolver.resolve(mappings, request);

  test.equals(result.host, '10.0.0.101');
  test.equals(result.port, 101);
  test.done();
};

exports['should pass headers through'] = function(test){
  var mappings = [{}];
  var request = mockRequest();
  request.headers.arbitrary = 'whatever';

  var result = resolver.resolve(mappings, request);

  test.equals(result.headers.arbitrary, 'whatever');
  test.done();
};

exports['should pass path through'] = function(test){
  var mappings = [{}];
  var request = mockRequest();
  request.url = '/a/b?x=y';

  var result = resolver.resolve(mappings, request);

  test.equals(result.url, '/a/b?x=y');
  test.done();
};
