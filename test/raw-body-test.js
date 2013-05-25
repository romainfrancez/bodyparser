/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    assert = require('assert'),
    http = require('http'),
    vows = require('vows'),

    RawBody = require('./../lib/RawBody.js').RawBody,

    options,
    server;

  options = {
    hostname: 'localhost',
    port: '8000',
    path: '/',
    method: 'POST'
  };

  server = http.createServer(function (request, response) {
    var
      rb;

    rb = new RawBody(request, function (err, data) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end(data.toString());
    });
    rb.parse();
  }).listen(8000);

  exports.rawbody = vows.describe('Raw Body').addBatch({
    'Normal': {
      topic: function () {
        var
          i,
          request,
          self = this;

        request = http.request(options, function (response) {
          var
            rb;

          rb = new RawBody(response, function (err, data) {
            self.callback(null, data);
          });
          rb.parse();
        });

        for (i = 0; i < 10; i += 1) {
          request.write('data\n');
        }
        request.end();
      },
      'data': function (err, data) {
        var
          i,
          s = '';
        for (i = 0; i < 10; i += 1) {
          s += 'data\n';
        }
        assert.equal(s, data);
      }
    }
  });
}());
