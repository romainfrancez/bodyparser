/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    BodyParser = require('./BodyParser').BodyParser,
    util = require('util'),

    RawBody;

  RawBody = function (request, callback, options) {
    BodyParser.call(this, request, callback, options);

    var
      Buffer = require('buffer').Buffer;

    this.body = new Buffer(this.length);
    this.bytesWritten = 0;
  };
  util.inherits(RawBody, BodyParser);

  RawBody.prototype.readable = function (chunk) {
    var
      newLength = chunk.length + this.bytesWritten;
  
    if (newLength > this.body.length) {
      this.body = Buffer.concat([this.body, chunk], newLength);
    } else {
      chunk.copy(this.body, this.bytesWritten);
    }

    this.bytesWritten = newLength;
  };

  exports.RawBody = RawBody;

}());