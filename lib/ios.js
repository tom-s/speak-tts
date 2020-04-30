"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterIOSVoices = exports.iOSversion = void 0;

var iOSversion = function iOSversion() {
  if (/(iPhone|iPad|iPod)/.test(navigator.platform)) {
    var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(v[1], 10);
  }

  return false;
};

exports.iOSversion = iOSversion;

var filterIOSVoices = function filterIOSVoices(voices) {
  var selectableVoices = ['Maged', 'Zuzana', 'Sara', 'Anna', 'Melina', 'Karen', 'Samantha', 'Daniel', 'Rishi', 'Moira', 'Tessa', 'Mónica', 'Paulina', 'Satu', 'Amélie', 'Thomas', 'Carmit', 'Lekha', 'Mariska', 'Damayanti', 'Alice', 'Kyoko', 'Yuna', 'Ellen', 'Xander', 'Nora', 'Zosia', 'Luciana', 'Joana', 'Ioana', 'Milena', 'Laura', 'Alva', 'Kanya', 'Yelda', 'Tian-Tian', 'Sin-Ji', 'Mei-Jia'];
  return voices.filter(function (v) {
    if (selectableVoices.includes(v.name)) {
      return true;
    }

    return false;
  });
};

exports.filterIOSVoices = filterIOSVoices;