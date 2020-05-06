"use strict";

/* eslint-disable import/no-extraneous-dependencies,node/no-unpublished-require */
require('core-js/modules/es.promise');

require('core-js/modules/es.string.includes');

require('core-js/modules/es.object.assign');

require('core-js/modules/es.object.keys');

require('regenerator-runtime/runtime');

var rewritePattern = require('regexpu-core');

var _require = require('@babel/helper-create-regexp-features-plugin/lib/util'),
    generateRegexpuOptions = _require.generateRegexpuOptions;

var _global = global,
    RegExp = _global.RegExp;

try {
  RegExp('a', 'u');
} catch (err) {
  global.RegExp = function (pattern, flags) {
    if (flags && flags.includes('u')) {
      return new RegExp(rewritePattern(pattern, flags, generateRegexpuOptions({
        flags: flags,
        pattern: pattern
      })));
    }

    return new RegExp(pattern, flags);
  };

  global.RegExp.prototype = RegExp;
}

var ExcelJS = {
  Workbook: require('./doc/workbook')
}; // Object.assign mono-fill

var Enums = require('./doc/enums');

Object.keys(Enums).forEach(function (key) {
  ExcelJS[key] = Enums[key];
});
module.exports = ExcelJS;
//# sourceMappingURL=exceljs.browser.js.map
