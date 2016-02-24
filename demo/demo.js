alert('start');
import Speech from '../src/speech.js';

Speech.init();
alert('ok');
let text = (Speech.browserSupport()) ? 'Hurray, your browser supports speech synthesis' : "Your browser does NOT support speech synthesis. We'll try anyway ! If it  doesn't work try using Chrome of Safari instead !";
alert("support ?", text);
document.getElementById("support").innerHTML = text;