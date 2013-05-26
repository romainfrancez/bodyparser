BodyParser [![Build Status](https://travis-ci.org/romainfrancez/bodyparser.png?branch=master)](https://travis-ci.org/romainfrancez/bodyparser)
==============================================================================================================================================

An HTTP(S) request body parser for node.js

Installation
------------

```
git clone git://github.com/romainfrancez/bodyparser.git bodyparser
```

Example
-------

```javascript
var
  BodyParser = require('bodyparser').BodyParser,
  http = require('http'),
  util = require('util');

http.createServer(function(request, response) {
  if (request.url === '/upload' && request.method === 'POST') {
    var
      bp;

    // Handle the data automatically according to its type
    bp = new BodyParser(request, function (err, data) {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('<h1>Submitted data</h1>\n');
      if (data instanceof Buffer) {
        response.write(util.inspect(data.toString()) + '<br/><br/>\n');
      } else {
        response.write(util.inspect(data) + '<br/><br/>\n');
      }
      response.write('<a href="/">Back</a>\n');
      response.end();
    });
    bp.parse();
    return;
  }
  
  
  // For convenience only, a couple of forms
  response.writeHead(200, {'content-type': 'text/html'});

  switch (request.url) {
    case '/urlencoded':
      response.write('<h1>URLEncoded</h1>\n');
      response.write('<form action="/upload" enctype="application/x-www-form-urlencoded" method="POST">\n');
      response.write('\tHello: <input type="text" name="hello"/><br/>\n');
      response.write('\tWorld: <input type="text" name="world"/><br/>\n');
      response.write('\t<input type="submit"/>\n');
      response.write('</form>\n');
      response.write('<a href="/">Back</a>\n');
      break;
    
    case '/json':
      response.write('<h1>JSON</h1>\n');
      response.write('<form action="/upload" enctype="application/json" method="POST">\n');
      response.write('\tHello: <input type="text" name="hello"/><br/>\n');
      response.write('\tWorld: <input type="text" name="world"/><br/>\n');
      response.write('\t<input type="submit"/>');
      response.write('</form>\n');
      response.write('<a href="/">Back</a>\n');
      break;

    case '/raw':
      response.write('<h1>Raw</h1>\n');
      response.write('<form action="/upload" enctype="text/plain" method="POST">\n');
      response.write('\tHello: <input type="text" name="hello"/><br/>\n');
      response.write('\tWorld: <input type="text" name="world"/><br/>\n');
      response.write('\t<input type="submit"/>');
      response.write('</form>\n');
      response.write('<a href="/">Back</a>\n');
      break;

    default:
      response.write('<h1>Options</h1>\n');
      response.write('<ul>\n');
      response.write('\t<li><a href="/urlencoded">URLEncoded</a></li>\n');
      response.write('\t<li><a href="/json">JSON</a></li>\n');
      response.write('\t<li><a href="/raw">Raw</a></li>\n');
      response.write('</ul>\n');
  }

  response.end();
}).listen(8000);
```

TODO
----

* Finish MultiPartParser
* Finish test cases
* Create benchmark