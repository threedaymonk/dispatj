Dispatj
=======

A server that proxies requests to downstream servers depending on the request
path in 60 lines of JavaScript. It's like Apache with mod_proxy, only
simpler.

Usage
-----

This example will proxy requests on any host to a path beginning with `/foo` to
port 8088 on `localhost`, and to a path beginning with `/bar` to port 80 on
`10.0.0.4`:

    var mappings = [
      { matchPath: '^/foo', port: 8088 },
      { matchPath: '^/bar', host: '10.0.0.4' }
    ];

    var listenPort = 8080;

    var dispatj = require('dispatj');
    dispatj.run(mappings, listenPort, sys.log);

Mappings
--------

The following keys can be specified in a mapping:

* `matchPath` — Regular expression which request path must match. Default: match any path.
* `matchHost` — Regular expression which request host must match. Default: match any host.
* `host` — Proxy the request to this host. Default: `localhost`.
* `port` — Proxy the request to this port. Default: `80`.

Prerequisites
-------------

* [node.js](http://nodejs.org/) (tested against 0.3.4)
* [async](https://github.com/caolan/async)
* [underscore](http://documentcloud.github.com/underscore/)

To run the tests, you will also need:

* [nodeunit](http://github.com/caolan/nodeunit)
* [jslint](https://github.com/reid/node-jslint)

All dependencies can be installed via [npm](http://npmjs.org/).
