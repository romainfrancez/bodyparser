/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    BodyParser;

  BodyParser = function (request, callback, options) {
    var
      contentType = request.headers['content-type'],
      Parser,
      self = this;

    if (this.constructor === BodyParser) {
      // parse headers and return appropriate bodyparser

      if (contentType === 'application/x-www-form-urlencoded') {
        Parser = require('./URLEncodedParser').URLEncodedParser;
      } else if (contentType.slice(0, 19) === 'multipart/form-data') {
        Parser = require('./MultiPartParser').MultiPartParser;
      } else if (contentType.match(/json/i)) {
        Parser = require('./JSONParser').JSONParser;
      } else {
        Parser = require('./RawBody').RawBody;
      }

      return new Parser(request, callback, options);
    }

    this.length = 0;
    if (request.headers['content-length']) {
      this.length = parseInt(request.headers['content-length'], 10);
    }

    this.parse = function () {
      if (typeof this.readable === 'function') {
        request.once('end', function () {
          this.removeListener('readable', self.readable);
          callback(null, self.body);
        });

        request.on('readable', function () {
          self.readable(this.read());
        });
      } else {
        callback(true);
      }
    };
  };

  exports.BodyParser = BodyParser;

}());