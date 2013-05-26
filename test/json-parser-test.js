/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    assert = require('assert'),
    http = require('http'),
    vows = require('vows'),

    JSONParser = require('./../lib/JSONParser.js').JSONParser,

    server;

  server = http.createServer(function (request, response) {
    var
      jp;

    jp = new JSONParser(request, function (err, data) {
      response.write(data);
      response.end();
    });
    jp.parse();
  }).listen(8002);

  exports.jsonparser = vows.describe('JSON Parser').addBatch({
    'Normal behavior': {
      topic: function () {
        var
          request,
          self = this;

        request = http.request({port: 8002, path: '/normal', method: 'POST'}, function (response) {
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
        request.write('{\n');
        request.write('"key1":"data1",\n');
        request.write('"key2":"data2"}');
        request.end();
      },
      '{key1:\'data1\', key2: \'data2\'}': function (err, data) {
        assert.equal(err, null);
        assert.deepEqual(data, {key1: 'data1', key2: 'data2'});
      }
    }
  });
}());
