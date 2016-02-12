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
	
	// For touch devices
	let timer = null;
	let selectedRange = null;
	let touchSelectedText = null;

	let _init = (conf) => {
		// Check browser support
		if(!_browserSupport()) {
			alert('browser do not support speech synthesis ! try chrome instead');
			return;
		}

		// Import conf
		CONF =_.merge(CONF, conf);

		// Start listening to events
		if(_touchSupport()) {
			
			window.ontouchstart = (e) => {
				touchSelectedText = null;
				timer = setInterval(_captureTouchSelectedText, 150);
			}

			window.ontouchend = (e) => {
				if (touchSelectedText) {
            		_speak(touchSelectedText);
            		alert('speak ' + touchSelectedText);
            		clearInterval(timer);
        		}
			}
		} else {
			window.onmouseup = (e) => {
				let text = _getSelectedText();
				_speak(text);
			}
		}
		
		
	}

	let _browserSupport = () => {
		return 'speechSynthesis' in window;
	}

	let _touchSupport = () => {
		return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
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
		let utterance = new SpeechSynthesisUtterance();
		//utterance.voice = voices[10]; // Note: some voices don't support altering params
		//utterance.voiceURI = 'native';
		utterance.volume = CONF.volume; // 0 to 1
		utterance.rate = CONF.rate; // 0.1 to 10
		utterance.pitch = CONF.pitch; //0 to 2
		utterance.text = msg;
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
		utterance.lang = lang;
		//
		utterance.onerror = function (e) {
        	console.log("an error occured", e);
    	};
    	window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utterance);
	}

	return {
		init: _init,
		//speak: _speak
	}
})(window);

export default Speech;