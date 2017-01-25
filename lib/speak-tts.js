'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _trim = require('lodash/trim');

var _trim2 = _interopRequireDefault(_trim);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _franc = require('franc');

var _franc2 = _interopRequireDefault(_franc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SpeakTTS = function (window) {
  var CONF = {
    'lang': null,
    'volume': 1,
    'rate': 1,
    'pitch': 1,
    'onVoicesLoaded': function onVoicesLoaded(data) {}
  };

  //Fallback cache voices for ios
  // iOS 8
  var iOS8voices = [{ name: "pt-BR", voiceURI: "pt-BR", lang: "pt-BR", localService: true, default: true }, { name: "fr-CA", voiceURI: "fr-CA", lang: "fr-CA", localService: true, default: true }, { name: "sk-SK", voiceURI: "sk-SK", lang: "sk-SK", localService: true, default: true }, { name: "th-TH", voiceURI: "th-TH", lang: "th-TH", localService: true, default: true }, { name: "ro-RO", voiceURI: "ro-RO", lang: "ro-RO", localService: true, default: true }, { name: "no-NO", voiceURI: "no-NO", lang: "no-NO", localService: true, default: true }, { name: "fi-FI", voiceURI: "fi-FI", lang: "fi-FI", localService: true, default: true }, { name: "pl-PL", voiceURI: "pl-PL", lang: "pl-PL", localService: true, default: true }, { name: "de-DE", voiceURI: "de-DE", lang: "de-DE", localService: true, default: true }, { name: "nl-NL", voiceURI: "nl-NL", lang: "nl-NL", localService: true, default: true }, { name: "id-ID", voiceURI: "id-ID", lang: "id-ID", localService: true, default: true }, { name: "tr-TR", voiceURI: "tr-TR", lang: "tr-TR", localService: true, default: true }, { name: "it-IT", voiceURI: "it-IT", lang: "it-IT", localService: true, default: true }, { name: "pt-PT", voiceURI: "pt-PT", lang: "pt-PT", localService: true, default: true }, { name: "fr-FR", voiceURI: "fr-FR", lang: "fr-FR", localService: true, default: true }, { name: "ru-RU", voiceURI: "ru-RU", lang: "ru-RU", localService: true, default: true }, { name: "es-MX", voiceURI: "es-MX", lang: "es-MX", localService: true, default: true }, { name: "zh-HK", voiceURI: "zh-HK", lang: "zh-HK", localService: true, default: true }, { name: "sv-SE", voiceURI: "sv-SE", lang: "sv-SE", localService: true, default: true }, { name: "hu-HU", voiceURI: "hu-HU", lang: "hu-HU", localService: true, default: true }, { name: "zh-TW", voiceURI: "zh-TW", lang: "zh-TW", localService: true, default: true }, { name: "es-ES", voiceURI: "es-ES", lang: "es-ES", localService: true, default: true }, { name: "zh-CN", voiceURI: "zh-CN", lang: "zh-CN", localService: true, default: true }, { name: "nl-BE", voiceURI: "nl-BE", lang: "nl-BE", localService: true, default: true }, { name: "en-GB", voiceURI: "en-GB", lang: "en-GB", localService: true, default: true }, { name: "ar-SA", voiceURI: "ar-SA", lang: "ar-SA", localService: true, default: true }, { name: "ko-KR", voiceURI: "ko-KR", lang: "ko-KR", localService: true, default: true }, { name: "cs-CZ", voiceURI: "cs-CZ", lang: "cs-CZ", localService: true, default: true }, { name: "en-ZA", voiceURI: "en-ZA", lang: "en-ZA", localService: true, default: true }, { name: "en-AU", voiceURI: "en-AU", lang: "en-AU", localService: true, default: true }, { name: "da-DK", voiceURI: "da-DK", lang: "da-DK", localService: true, default: true }, { name: "en-US", voiceURI: "en-US", lang: "en-US", localService: true, default: true }, { name: "en-IE", voiceURI: "en-IE", lang: "en-IE", localService: true, default: true }, { name: "he-IL", voiceURI: "he-IL", lang: "he-IL", localService: true, default: true }, { name: "hi-IN", voiceURI: "hi-IN", lang: "hi-IN", localService: true, default: true }, { name: "el-GR", voiceURI: "el-GR", lang: "el-GR", localService: true, default: true }, { name: "ja-JP", voiceURI: "ja-JP", lang: "ja-JP", localService: true, default: true }];

  // IOS9
  var iOS9voices = [{ name: "Maged", voiceURI: "com.apple.ttsbundle.Maged-compact", lang: "ar-SA", localService: true, "default": true }, { name: "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact", lang: "cs-CZ", localService: true, "default": true }, { name: "Sara", voiceURI: "com.apple.ttsbundle.Sara-compact", lang: "da-DK", localService: true, "default": true }, { name: "Anna", voiceURI: "com.apple.ttsbundle.Anna-compact", lang: "de-DE", localService: true, "default": true }, { name: "Melina", voiceURI: "com.apple.ttsbundle.Melina-compact", lang: "el-GR", localService: true, "default": true }, { name: "Karen", voiceURI: "com.apple.ttsbundle.Karen-compact", lang: "en-AU", localService: true, "default": true }, { name: "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact", lang: "en-GB", localService: true, "default": true }, { name: "Moira", voiceURI: "com.apple.ttsbundle.Moira-compact", lang: "en-IE", localService: true, "default": true }, { name: "Samantha (Enhanced)", voiceURI: "com.apple.ttsbundle.Samantha-premium", lang: "en-US", localService: true, "default": true }, { name: "Samantha", voiceURI: "com.apple.ttsbundle.Samantha-compact", lang: "en-US", localService: true, "default": true }, { name: "Tessa", voiceURI: "com.apple.ttsbundle.Tessa-compact", lang: "en-ZA", localService: true, "default": true }, { name: "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact", lang: "es-ES", localService: true, "default": true }, { name: "Paulina", voiceURI: "com.apple.ttsbundle.Paulina-compact", lang: "es-MX", localService: true, "default": true }, { name: "Satu", voiceURI: "com.apple.ttsbundle.Satu-compact", lang: "fi-FI", localService: true, "default": true }, { name: "Amelie", voiceURI: "com.apple.ttsbundle.Amelie-compact", lang: "fr-CA", localService: true, "default": true }, { name: "Thomas", voiceURI: "com.apple.ttsbundle.Thomas-compact", lang: "fr-FR", localService: true, "default": true }, { name: "Carmit", voiceURI: "com.apple.ttsbundle.Carmit-compact", lang: "he-IL", localService: true, "default": true }, { name: "Lekha", voiceURI: "com.apple.ttsbundle.Lekha-compact", lang: "hi-IN", localService: true, "default": true }, { name: "Mariska", voiceURI: "com.apple.ttsbundle.Mariska-compact", lang: "hu-HU", localService: true, "default": true }, { name: "Damayanti", voiceURI: "com.apple.ttsbundle.Damayanti-compact", lang: "id-ID", localService: true, "default": true }, { name: "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", lang: "it-IT", localService: true, "default": true }, { name: "Kyoko", voiceURI: "com.apple.ttsbundle.Kyoko-compact", lang: "ja-JP", localService: true, "default": true }, { name: "Yuna", voiceURI: "com.apple.ttsbundle.Yuna-compact", lang: "ko-KR", localService: true, "default": true }, { name: "Ellen", voiceURI: "com.apple.ttsbundle.Ellen-compact", lang: "nl-BE", localService: true, "default": true }, { name: "Xander", voiceURI: "com.apple.ttsbundle.Xander-compact", lang: "nl-NL", localService: true, "default": true }, { name: "Nora", voiceURI: "com.apple.ttsbundle.Nora-compact", lang: "no-NO", localService: true, "default": true }, { name: "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact", lang: "pl-PL", localService: true, "default": true }, { name: "Luciana", voiceURI: "com.apple.ttsbundle.Luciana-compact", lang: "pt-BR", localService: true, "default": true }, { name: "Joana", voiceURI: "com.apple.ttsbundle.Joana-compact", lang: "pt-PT", localService: true, "default": true }, { name: "Ioana", voiceURI: "com.apple.ttsbundle.Ioana-compact", lang: "ro-RO", localService: true, "default": true }, { name: "Milena", voiceURI: "com.apple.ttsbundle.Milena-compact", lang: "ru-RU", localService: true, "default": true }, { name: "Laura", voiceURI: "com.apple.ttsbundle.Laura-compact", lang: "sk-SK", localService: true, "default": true }, { name: "Alva", voiceURI: "com.apple.ttsbundle.Alva-compact", lang: "sv-SE", localService: true, "default": true }, { name: "Kanya", voiceURI: "com.apple.ttsbundle.Kanya-compact", lang: "th-TH", localService: true, "default": true }, { name: "Yelda", voiceURI: "com.apple.ttsbundle.Yelda-compact", lang: "tr-TR", localService: true, "default": true }, { name: "Ting-Ting", voiceURI: "com.apple.ttsbundle.Ting-Ting-compact", lang: "zh-CN", localService: true, "default": true }, { name: "Sin-Ji", voiceURI: "com.apple.ttsbundle.Sin-Ji-compact", lang: "zh-HK", localService: true, "default": true }, { name: "Mei-Jia", voiceURI: "com.apple.ttsbundle.Mei-Jia-compact", lang: "zh-TW", localService: true, "default": true }];

  // Because chrome triggers voicechanged too often
  var currentVoices = [];

  var _iOSversion = function _iOSversion() {
    if (/(iPhone|iPad|iPod)/.test(navigator.platform)) {
      var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      return parseInt(v[1], 10);
    }
    return false;
  };

  var _splitSentences = function _splitSentences(text) {
    return text.replace(/\.+/g, '.|').replace(/\?/g, '?|').replace(/\!/g, '!|').split("|").map(function (sentence) {
      return (0, _trim2.default)(sentence);
    });
  };

  var init = function init(conf) {
    // Import conf
    if (conf) CONF = _extends({}, CONF, conf);

    // Polyfill
    if (!browserSupport()) {
      return false;
    } else {
      // On Chrome, voices are loaded asynchronously
      if ('onvoiceschanged' in window.speechSynthesis) {
        speechSynthesis.onvoiceschanged = (0, _debounce2.default)(function () {
          if (currentVoices.length !== window.speechSynthesis.getVoices().length) {
            currentVoices = window.speechSynthesis.getVoices();
            if (CONF.onVoicesLoaded) CONF.onVoicesLoaded({
              voices: window.speechSynthesis.getVoices()
            });
          }
        }, 300);
      } else {
        var iosVersion = _iOSversion();
        if (iosVersion) {
          _initIOS(iosVersion);
        }
      }
    }
  };

  var _initIOS = function _initIOS(version) {
    // Sometimes IOS has no voice (bug), so we try to handle it
    if (version >= 9) {
      if (window.speechSynthesis.getVoices().length === 0) {
        delete window.speechSynthesis.getVoices;
        window.speechSynthesis.getVoices = function () {
          return iOS9voices;
        }; // use cached voices
      }
      if (CONF.onVoicesLoaded) CONF.onVoicesLoaded({
        voices: window.speechSynthesis.getVoices()
      });
    } else if (version >= 8) {
      // Try with a timeout
      setTimeout(function () {
        if (window.speechSynthesis.getVoices().length === 0) {
          delete window.speechSynthesis.getVoices;
          window.speechSynthesis.getVoices = function () {
            return iOS8voices;
          }; // use cached voices
        }
        if (CONF.onVoicesLoaded) CONF.onVoicesLoaded({
          voices: window.speechSynthesis.getVoices()
        });
      }, 100);
    }
    // if not 8 or 7, not worth trying anything
  };

  var browserSupport = function browserSupport() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  };

  var stop = function stop() {
    window.speechSynthesis.cancel();
  };

  var setLanguage = function setLanguage(lang) {
    if (lang) CONF.lang = lang;
  };

  var speak = function speak(data) {
    var text = data.text,
        onEnd = data.onEnd,
        onError = data.onError;

    var msg = (0, _trim2.default)(text);

    if (!msg || msg === '.') return; // when click on empty space value is '.' for some weird reason
    var lang = function () {
      if (CONF.lang) return CONF.lang;
      var flang = (0, _franc2.default)(msg);
      switch (flang) {
        case 'arb':
          return "ar-SA"; // arabic
        case 'ces':
          return "cs-CZ"; // czech
        case 'dan':
          return "da-DK"; // danish
        case 'ger':
          return "de-DE"; // german
        case 'ell':
          return "el-GR"; // greek
        case 'eng':
          return "en-GB"; // english
        case 'spa':
          return "es-ES"; // spanish
        case 'fin':
          return "fi-FI"; // finish
        case 'fra':
          return "fr-FR"; // french
        case 'heb':
          return "he-IL"; // hebrew
        case 'hin':
          return "hi-IN"; // hindi
        case 'hun':
          return "hu-HU"; // hungarian
        case 'ind':
          return "id-ID"; // indonesian
        case 'ita':
          return "it-IT"; // italian
        case 'jpn':
          return "ja-JP"; // japanese
        case 'kor':
          return "ko-KR"; // korean
        case 'nld':
          return "nl-NL"; // dutch
        case 'nno':
          return "no-NO"; // norwegian
        case 'pol':
          return "pl-PL"; // polish
        case 'por':
          return "pt-PT"; // portuguese
        case 'ron':
          return "ro-RO"; // romanian
        case 'rus':
          return "ru-RU"; // russian
        case 'slk':
          return "sk-SK"; // slovak
        case 'swe':
          return "sv-SE"; // swedish
        case 'tha':
          return "th-TH"; // thai
        case 'tuk':
          return "tr-TR"; // turkish
        case 'cmn':
          return "zh-CN"; // chinese (S)
        default:
          return 'en-US';
      }
    }();

    // Stop current speech
    stop();

    // Split into sentances (for better result and bug with some versions of chrome)
    var sentences = _splitSentences(msg);
    sentences.forEach(function (sentence, index) {
      var isLast = index === sentences.length - 1;
      var utterance = new window.SpeechSynthesisUtterance();
      var voice = window.speechSynthesis.getVoices().find(function (voice) {
        return voice.lang.replace('_', '-') === lang; // handle android specificites
      });
      utterance.lang = lang;
      utterance.volume = parseFloat(CONF.volume); // 0 to 1
      utterance.rate = parseFloat(CONF.rate); // 0.1 to 10
      utterance.pitch = parseFloat(CONF.pitch); //0 to 2
      utterance.text = sentence;

      if (voice) {
        utterance.voice = voice;
      } else {
        if (onError) onError({ msg: 'no voice available' });
        return;
      }

      utterance.onerror = function (e) {
        if (onError) onError(e);
      };
      utterance.onend = function (e) {
        if (onEnd && isLast) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  return {
    init: init,
    browserSupport: browserSupport,
    speak: speak,
    stop: stop,
    setLanguage: setLanguage
  };
}(window);

exports.default = SpeakTTS;