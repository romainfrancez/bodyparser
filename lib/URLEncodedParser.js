/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    BodyParser = require('./BodyParser').BodyParser,
    Buffer = require('buffer').Buffer,
    querystring = require('querystring'),
    util = require('util'),

    URLEncodedParser;

  URLEncodedParser = function (request, callback, options) {
    BodyParser.call(this, request, callback, options);

    this.body = {};
    this.previous = new Buffer(0);

  };
  util.inherits(URLEncodedParser, BodyParser);

  URLEncodedParser.prototype.readable = function (chunk) {
    var
      buffer = Buffer.concat([this.previous, chunk]).toString(),
      key,
      lastIndex = buffer.lastIndexOf('&'),
      query;

    if (lastIndex > 0) {
      query = buffer.substr(0, lastIndex);
      query = querystring.parse(query, '&', '=', 0);

      for (key in query) {
        if (query.hasOwnProperty(key)) {
          this.body[key] = query[key];
        }
      }
      buffer = buffer.substr(lastIndex + 1, buffer.length);
    }
    this.previous = new Buffer(buffer);
  };

  URLEncodedParser.prototype.end = function () {
    var
      key,
      query = querystring.parse(this.previous.toString(), '&', '=', 0);

    for (key in query) {
      if (query.hasOwnProperty(key)) {
        this.body[key] = query[key];
      }
    }
  };

  exports.URLEncodedParser = URLEncodedParser;

}());
