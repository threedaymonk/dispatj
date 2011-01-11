var common = require('./common'),
		dispatj = require('dispatj'),
		http = require('http');

var echo = function(req, res) {
	res.writeHead(200);
	res.write(JSON.stringify({
	  headers: req.headers,
		url: req.url
  }));
	res.end();
};

var httpRequest = function(host, port, path, headers, callback){
	var body = '';
	var client = http.createClient(port, host);
  var req = client.request('GET', path, headers);

	req.on('response', function(res){
		res.on('data', function(chunk){
			body += chunk;
		});
		res.on('end', function(){
			callback(body);
	  });
	});

	req.end();
};

exports['full-stack mapping request'] = function(test){
	var server = http.createServer(echo);
	server.listen(31080);
	var mappings = [{
		matchHost: 'example.com',
		matchPath: '/foo',
		host: 'localhost',
		port: 31080
	}];
	var proxy = dispatj.run(mappings, 31081);

	setTimeout(function(){
	  httpRequest('localhost', 31081, '/foo?a=1', {host: 'example.com'}, function(body){
			var data = JSON.parse(body);
			test.equals(data.url, '/foo?a=1');
			test.equals(data.headers.host, 'localhost');
			server.close();
			proxy.close();
			test.done();
		});
  }, 20);
}
