import _ from 'lodash';
import franc from 'franc';

let Speech = ((window) => {
	
	let CONF = {
		//'lang' : 'en-GB', // if no language specified, automatic detection will be done
		'volume': 1,
		'rate': 1,
		'pitch': 1
	};

	//let voices = window.speechSynthesis.getVoices();
	
	// For polyfill
	let audio = null;

	let _init = (conf) => {
		// Polyfill
		if(!_browserSupport()) {
			window.speechSynthesis = {
		        speak: (utterance) => {
		            let url = 'http://translate.google.com/translate_tts?&q=' + encodeURIComponent(utterance.text) + '&tl=' + utterance.lang;
		            audio = new Audio(url);
		            audio.volume = utterance.volume;
		            audio.play();
		            audio.addEventListener('ended', utterance.onend);
		            audio.addEventListener('play', utterance.onstart);
		        },

		        cancel: () => {
		        	if(audio) audio.stop();
		        }
		    };
		}

		// Import conf
		CONF =_.merge(CONF, conf);

		// Start listening to events
		if(_touchSupport()) {
			window.document.onselectionchange = _.debounce((e) => {
				let text = _getSelectedText();
				_speak(text);
			}, 1000);
		} else {
			window.onmouseup = (e) => {
				let text = _getSelectedText();
				_speak(text);
			}
		}

		
		
		
	}

	let _browserSupport = () => {
		return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
	}

	let _touchSupport = () => {
		return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
	}

	let _getSpeechUtterance = (lang) => {
		if(!_browserSupport()) {
			window.SpeechSynthesisUtterance = function (text) {
				return {
					lang: lang,
					volume: 1.0,
					onend: function () {},
					onstart: function () {},
					text: text
				};
			};
		}
		
		return new SpeechSynthesisUtterance();
	}
	
	let _captureTouchSelectedText = ()=> {
		touchSelectedText = _getSelectedText();
	}

	let _getSelectedText = () => {
		let txt = '';
	    if (window.getSelection) {
	        txt = window.getSelection().toString();
	    } else if (window.document.getSelection) {
	        txt = window.document.getSelection().toString();
	    } else if (window.document.selection) {
	        txt = window.document.selection.createRange().text;
	    }
	    return txt;  
	}

	let _speak = (msg) => {
		if(!msg) return;
		var lang = (() => {
			if(CONF.lang) return CONF.lang;
			var lang = franc(msg, {'whitelist' : ['eng', 'fra', 'deu']});
			switch(lang) {
				case 'eng': return 'en-GB';
				case 'fra': return 'fr-FR';
				case 'deu': return 'de-DE';
				default: return 'en-GB';
			}
		})();

		let utterance = _getSpeechUtterance(lang);
		//utterance.voice = voices[10]; // Note: some voices don't support altering params
		//utterance.voiceURI = 'native';
		utterance.volume = CONF.volume; // 0 to 1
		utterance.rate = CONF.rate; // 0.1 to 10
		utterance.pitch = CONF.pitch; //0 to 2
		utterance.text = msg;
		
		utterance.lang = lang;
		//
		utterance.onerror = function (e) {
        	alert("an error occured", e);
    	};
    	window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utterance);
	}

	return {
		init: _init,
		browserSupport: _browserSupport
	}
})(window);

export default Speech;