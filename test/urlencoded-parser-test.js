/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    assert = require('assert'),
    http = require('http'),
    vows = require('vows'),

    JSONParser = require('./../lib/JSONParser.js').JSONParser,
    URLEncodedParser = require('./../lib/URLEncodedParser.js').URLEncodedParser,

    server;

  server = http.createServer(function (request, response) {
    var
      up;

    up = new URLEncodedParser(request, function (err, data) {
      response.write(JSON.stringify(data));
      response.end();
    });
    up.parse();
  }).listen(8003);

  exports.urlencodedparser = vows.describe('URLEncoded Parser').addBatch({
    'Normal behavior': {
      topic: function () {
        var
          request,
          self = this;

        request = http.request({port: 8003, path: '/normal', method: 'POST'}, function (response) {
          var
            jp;

          jp = new JSONParser(response, function (err, data) {
            self.callback(err, data);
          });
          jp.parse();
        });
        request.on('error', function (err) {
          self.callback(err);
        });
        request.write('key1=');
        request.write('data1&');
        request.write('key2=data2');
        request.end();
      },
      'key1=data1&key2=data2': function (err, data) {
        assert.equal(err, null);
        assert.deepEqual(data, {key1: 'data1', key2: 'data2'});
      }
    }
  });
}());
