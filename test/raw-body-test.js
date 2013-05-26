/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    assert = require('assert'),
    http = require('http'),
    vows = require('vows'),

    RawBody = require('./../lib/RawBody.js').RawBody,

    server;

  server = http.createServer(function (request, response) {
    var
      rb;

    rb = new RawBody(request, function (err, data) {
      response.write(data);
      response.end();
    });
    rb.parse();
  }).listen(8001);

  exports.rawbody = vows.describe('Raw Body').addBatch({
    'Normal behavior': {
      topic: function () {
        var
          i,
          request,
          self = this;

        request = http.request({port: 8001, path: '/normal', method: 'POST'}, function (response) {
          var
            rb;

          rb = new RawBody(response, function (err, data) {
            self.callback(err, data);
          });
          rb.parse();
        });
        request.on('error', function (err) {
          self.callback(err);
        });
        request.write('data1');
        request.write('data2');
        request.end();
      },
      'data1data2': function (err, data) {
        var
          i,
          s = 'data1data2';

        assert.equal(err, null);
        assert.equal(data.toString(), s);
      }
    }
  });
}());
