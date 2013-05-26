/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    assert = require('assert'),
    vows = require('vows'),

    BodyParser = require('./../lib/BodyParser.js').BodyParser,
    JSONParser = require('./../lib/JSONParser.js').JSONParser,
    RawBody = require('./../lib/RawBody.js').RawBody,
    URLEncodedParser = require('./../lib/URLEncodedParser.js').URLEncodedParser;

  exports.jsonparser = vows.describe('Body Parser').addBatch({
    'application/json': {
      topic: new BodyParser({headers: {'content-type': 'application/json'}}),
      'JSONParser': function (parser) {
        assert.equal(parser.constructor, JSONParser);
      }
    },
    'text/plain': {
      topic: new BodyParser({headers: {'content-type': 'text/plain'}}),
      'RawBody': function (parser) {
        assert.equal(parser.constructor, RawBody);
      }
    },
    'application/x-www-form-urlencoded': {
      topic: new BodyParser({headers: {'content-type': 'application/x-www-form-urlencoded'}}),
      'URLEncodedParser': function (parser) {
        assert.equal(parser.constructor, URLEncodedParser);
      }
    }
  });
}());
