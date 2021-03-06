"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return function ({
    addUtilities,
    variants
  }) {
    addUtilities({
      '.backdrop-filter': {
        '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
        'backdrop-filter': ['var(--tw-backdrop-blur)', 'var(--tw-backdrop-brightness)', 'var(--tw-backdrop-contrast)', 'var(--tw-backdrop-grayscale)', 'var(--tw-backdrop-hue-rotate)', 'var(--tw-backdrop-invert)', 'var(--tw-backdrop-opacity)', 'var(--tw-backdrop-saturate)', 'var(--tw-backdrop-sepia)'].join(' ')
      },
      '.backdrop-filter-none': {
        'backdrop-filter': 'none'
      }
    }, variants('backdropFilter'));
  };
}