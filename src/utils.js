export const splitSentences = (text = '') => text.replace(/\.+/g,'.|')
  .replace(/\?/g,'?|')
  .replace(/\!/g,'!|')
  .split("|")
  .map(sentence => trim(sentence))
  .filter(Boolean)

const bcp47LocalePattern = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i; // eslint-disable-line max-len

/**
 * Validate a locale string to test if it is bcp47 compliant
 * @param {String} locale The tag locale to parse
 * @return {Boolean} True if tag is bcp47 compliant false otherwise
 */
export const validateLocale = locale =>  (typeof locale !== 'string')
  ? false
  : bcp47LocalePattern.test(locale)

export const isString = value => 
  typeof value === 'string' || value instanceof String

export const size = value =>  value && Array.isArray(value) && value.length
  ? value.length
  : 0

export const isNan = value => 
  typeof value === "number" && isNaN(value)

export const isNil = value =>
  value === null || value === undefined

export const isObject = value =>
  Object.prototype.toString.call(value) === '[object Object]'

export const trim = value => isString(value)
  ? value.trim()
  : ''
