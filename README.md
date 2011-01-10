Dispatj
=======

A server that proxies requests to downstream servers depending on the request
path in about 90 lines of JavaScript. It's like Apache with mod_proxy, only
simpler.

Usage
-----

    var mappings = [
      { matchPath: '^/foo', port: 8088 },
      { matchPath: '^/bar', host: '10.0.0.4' }
    ];

    var listenPort = 8080;

    var dispatj = require('dispatj');
    dispatj.run(mappings, listenPort);

Mappings
--------

The following keys can be specified in a mapping:

* `matchPath` — Regular expression which request path must match. Default: match any path.
* `matchHost` — Regular expression which request host must match. Default: match any host.
* `host` — Proxy the request to this host. Default: `localhost`.
* `port` — Proxy the request to this port. Default: `80`.

Prerequisites
-------------

* node.js (tested against 0.3.4)

To run the tests, you will also need:

* nodeunit (to run tests)
