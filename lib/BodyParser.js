/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    BodyParser,

    regexMultiPart = /^multipart\/form-data/i,
    regexJSON = /json/i,
    regexURLEncoded = /^application\/x-www-form-urlencoded/i;

  BodyParser = function (request, callback, options) {
    var
      contentType = request.headers['content-type'],
      Parser,
      self = this;

    if (this.constructor === BodyParser) {
      // parse headers and return appropriate bodyparser

      if (contentType.match(regexURLEncoded)) {
        Parser = require('./URLEncodedParser').URLEncodedParser;
      } else if (contentType.match(regexMultiPart)) {
        Parser = require('./MultiPartParser').MultiPartParser;
      } else if (contentType.match(regexJSON)) {
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
      var
        typeofReadable = typeof this.readable,
        typeofEnd = typeof this.end;

      if (typeofReadable === 'function' || typeofEnd === 'function') {
        request.once('end', function () {
          if (typeofEnd === 'function') {
            self.end();
          }
          callback(null, self.body);
        });
        
        if (typeofReadable === 'function') {
          request.once('end', function () {
            this.removeListener('readable', self.readable);
          });

          request.on('readable', function () {
            self.readable(this.read());
          });
        }
      } else {
        callback(true);
      }
    };
  };

  exports.BodyParser = BodyParser;

}());