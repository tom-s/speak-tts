"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterIOSVoices = exports.isIos = void 0;

var isIos = function isIos() {
  return /(iPhone|iPad|iPod)/.test(navigator.platform);
};

exports.isIos = isIos;

var filterIOSVoices = function filterIOSVoices(voices) {
  var selectableVoices = ['Maged', 'Zuzana', 'Sara', 'Anna', 'Melina', 'Karen', 'Samantha', 'Daniel', 'Rishi', 'Moira', 'Tessa', 'Mónica', 'Paulina', 'Satu', 'Amélie', 'Thomas', 'Carmit', 'Lekha', 'Mariska', 'Damayanti', 'Alice', 'Kyoko', 'Yuna', 'Ellen', 'Xander', 'Nora', 'Zosia', 'Luciana', 'Joana', 'Ioana', 'Milena', 'Laura', 'Alva', 'Kanya', 'Yelda', 'Tian-Tian', 'Sin-Ji', 'Mei-Jia'];
  return voices.filter(function (v) {
    return selectableVoices.includes(v.name);
  });
};

exports.filterIOSVoices = filterIOSVoices;