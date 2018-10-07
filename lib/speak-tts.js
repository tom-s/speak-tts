'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _trim = require('lodash/trim');

var _trim2 = _interopRequireDefault(_trim);

var _size = require('lodash/size');

var _size2 = _interopRequireDefault(_size);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _isNil = require('lodash/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isFinite = require('lodash/isFinite');

var _isFinite2 = _interopRequireDefault(_isFinite);

var _utils = require('./utils');

var _ios = require('./ios');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpeakTTS = function () {
  function SpeakTTS() {
    _classCallCheck(this, SpeakTTS);

    this.browserSupport = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    this.synthesisVoice = null;
  }

  _createClass(SpeakTTS, [{
    key: 'init',
    value: function init(conf) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (!_this.browserSupport) {
          reject('Your browser does not support Speech Synthesis');
        }
        _this.splitSentences = (0, _get2.default)(conf, 'splitSentences', true);
        var lang = (0, _get2.default)(conf, 'lang');
        var volume = (0, _get2.default)(conf, 'volume');
        var rate = (0, _get2.default)(conf, 'rate');
        var pitch = (0, _get2.default)(conf, 'pitch');
        var voice = (0, _get2.default)(conf, 'voice');

        _this._loadVoices().then(function (voices) {
          // Initialize values if necessary
          lang && _this.setLanguage(lang);
          voice && _this.setVoice(voice);
          volume && _this.setVolume(volume);
          rate && _this.setRate(rate);
          pitch && _this.setPitch(pitch);

          resolve({
            voices: voices,
            lang: _this.lang,
            voice: _this.voice,
            volume: _this.volume,
            rate: _this.rate,
            pitch: _this.pitch,
            browserSupport: _this.browserSupport
          });
        }).catch(reject);
      });
    }
  }, {
    key: '_loadVoices',
    value: function _loadVoices() {
      var _this2 = this;

      var handlePromise = function handlePromise(resolve, reject) {
        var voices = speechSynthesis.getVoices();
        if ((0, _isEmpty2.default)(voices)) {
          reject();
        } else {
          resolve(voices);
        }
      };

      return new Promise(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if ((0, _isEmpty2.default)(speechSynthesis.getVoices())) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt('return', resolve(voices));

                case 2:

                  // Async loading of voices
                  if (typeof speechSynthesis.onvoiceschanged !== 'undefined') {
                    speechSynthesis.onvoiceschanged = function () {
                      return handlePromise(resolve, reject);
                    };
                  } else {
                    _this2._tryfallbackVoices().finally(function () {
                      return handlePromise(resolve, reject);
                    });
                  }

                case 3:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this2);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: '_tryfallbackVoices',
    value: function _tryfallbackVoices() {
      // Try with a timeout
      var iosVersion = (0, _ios.iOSversion)();
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          // Sometimes IOS has no voice (bug), so we try to use cached voices instead
          if ((0, _isEmpty2.default)(speechSynthesis.getVoices())) {
            if (iosVersion) {
              delete speechSynthesis.getVoices;
              speechSynthesis.getVoices = function () {
                return version >= 9 ? _ios.iOS9voices : _ios.iOS8voices;
              };
              resolve();
            } else {
              reject();
            }
          }
        }, 100);
      });
    }
  }, {
    key: 'hasBrowserSupport',
    value: function hasBrowserSupport() {
      return this.browserSupport;
    }
  }, {
    key: 'setVoice',
    value: function setVoice(voice) {
      var synthesisVoice = void 0;
      var voices = speechSynthesis.getVoices();
      // set voice by name
      if ((0, _isString2.default)(voice)) {
        synthesisVoice = voices.find(function (v) {
          return v.name === voice;
        });
      }
      // Set the voice in conf if found
      if ((0, _isObject2.default)(voice)) {
        synthesisVoice = voice;
      }
      if (synthesisVoice) {
        this.synthesisVoice = synthesisVoice;
      } else {
        throw 'Error setting voice. The voice you passed is not valid or the voices have not been loaded yet.';
      }
    }
  }, {
    key: 'setLanguage',
    value: function setLanguage(lang) {
      if ((0, _utils.validateLocale)(lang)) {
        this.lang = lang;
      } else {
        throw 'Error setting language. Please verify your locale is BCP47 format (http://schneegans.de/lv/?tags=es-FR&format=text)';
      }
    }
  }, {
    key: 'setVolume',
    value: function setVolume(volume) {
      volume = parseFloat(volume);
      if ((0, _isFinite2.default)(volume) && volume >= 0 && volume <= 1) {
        this.volume = volume;
      } else {
        throw 'Error setting volume. Please verify your volume value is a number between 0 and 1.';
      }
    }
  }, {
    key: 'setRate',
    value: function setRate(rate) {
      rate = parseFloat(rate);
      if ((0, _isFinite2.default)(rate) && rate >= 0 && rate <= 10) {
        this.rate = rate;
      } else {
        throw 'Error setting rate. Please verify your volume value is a number between 0 and 10.';
      }
    }
  }, {
    key: 'setPitch',
    value: function setPitch(pitch) {
      pitch = parseFloat(pitch);
      if ((0, _isFinite2.default)(pitch) && pitch >= 0 && pitch <= 2) {
        this.pitch = pitch;
      } else {
        throw 'Error setting pitch. Please verify your pitch value is a number between 0 and 2.';
      }
    }
  }, {
    key: 'speak',
    value: function speak(data) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var text = data.text;

        var msg = (0, _trim2.default)(text);

        if ((0, _isNil2.default)(msg)) resolve();

        // Stop current speech
        _this3.stop();

        // Split into sentences (for better result and bug with some versions of chrome)
        var sentences = _this3.splitSentences ? (0, _utils.splitSentences)(msg) : [msg];
        sentences.forEach(function (sentence, index) {
          var isLast = index === (0, _size2.default)(sentences) - 1;
          var utterance = new SpeechSynthesisUtterance();
          if (_this3.synthesisVoice) utterance.voice = _this3.synthesisVoice;
          if (_this3.lang) utterance.lang = _this3.lang;
          if (_this3.volume) utterance.volume = _this3.volume; // 0 to 1
          if (_this3.rate) utterance.rate = _this3.rate; // 0.1 to 10
          if (_this3.pitch) utterance.pitch = _this3.pitch; //0 to 2
          utterance.text = sentence;
          utterance.onerror = reject;
          utterance.onend = function () {
            if (isLast) resolve();
          };
          speechSynthesis.speak(utterance);
        });
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      speechSynthesis.cancel();
    }
  }]);

  return SpeakTTS;
}();

exports.default = SpeakTTS;