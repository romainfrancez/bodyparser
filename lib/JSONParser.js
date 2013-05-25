/*jslint indent: 2, node: true */

(function () {
  'use strict';

  var
    BodyParser = require('./BodyParser').BodyParser,
    util = require('util'),

    JSONParser;

  JSONParser = function (request, callback, options) {
    BodyParser.call(this, request, callback, options);

    /*
    
    */
    this.parse = function () {
      var
        RawBody = require('./RawBody').RawBody,

        rawBody;

      rawBody = new RawBody(request, function (err, body) {
        try {
          callback(err, JSON.parse(body));
        } catch (e) {
          callback(err, body);
        }
      }, {});
      rawBody.parse();
    };
  };
  util.inherits(JSONParser, BodyParser);

  exports.JSONParser = JSONParser;

}());