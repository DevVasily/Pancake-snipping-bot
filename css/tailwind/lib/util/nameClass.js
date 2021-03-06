"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nameClass;

var _escapeClassName = _interopRequireDefault(require("./escapeClassName"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeCommas(className) {
  return className.replace(/\\,/g, '\\2c ');
}

function asClass(name) {
  return escapeCommas(`.${(0, _escapeClassName.default)(name)}`);
}

function nameClass(classPrefix, key) {
  if (key === 'DEFAULT') {
    return asClass(classPrefix);
  }

  if (key === '-') {
    return asClass(`-${classPrefix}`);
  }

  if (key.startsWith('-')) {
    return asClass(`-${classPrefix}${key}`);
  }

  return asClass(`${classPrefix}-${key}`);
}