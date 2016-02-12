import Speech from '../src/speech.js';

Speech.init();

let text = (Speech.browserSupport()) ? 'Hurray, our browser supports speech synthesis' : 'Your browser does NOT support speech synthesis, try Chrome of Safari !';
document.getElementById("support").innerHTML = text;