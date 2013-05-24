/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    BodyParser = require('./BodyParser').BodyParser,
    util = require('util'),

    URLEncodedParser;

  URLEncodedParser = function (request, callback, options) {
    BodyParser.call(this, request, callback, options);

    var
      Buffer = require('buffer').Buffer,

      bytesWritten = 0,
      self = this;

    this.body = new Buffer(this.length);
  };
  util.inherits(URLEncodedParser, BodyParser);

  URLEncodedParser.readable = function (chunk) {
    var
      newLength = chunk.length + bytesWritten,
      body = self.body;

    if (newLength > body.length) {
      body = Buffer.concat([body, chunk], newLength);
    } else {
      chunk.copy(body, bytesWritten);
    }

    bytesWritten = newLength;
  };

  exports.URLEncodedParser = URLEncodedParser;

}());
