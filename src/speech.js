import _ from 'lodash';
import franc from 'franc';
import rangy from 'rangy/lib/rangy-textrange';

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

	function _init(conf) {

		// Import conf
		CONF =_.merge(CONF, conf);

		// Polyfill
		if(!_browserSupport()) {
			window.speechSynthesis = {
		        speak(utterance) {
		            let url = 'http://translate.google.com/translate_tts?&q=' + encodeURIComponent(utterance.text) + '&tl=' + utterance.lang;
		            audio = new Audio(url);
		            audio.volume = utterance.volume;
		            audio.play();
		            audio.addEventListener('ended', () => {
		            	audio = null;

		            });
		            audio.addEventListener('play', utterance.onstart);
		        },

		        splitSentences(text) {
		        	return [text]; // no need to splut
		        },

		        cancel() {
		        	if(audio) audio.stop();
		        }
		    };

		    window.SpeechSynthesisUtterance = function (text) {
				return {
					lang: 'fr-FR',
					volume: CONF.volume,
					onend: function () {},
		            onstart: function () {},
					text: text
				};
			};
		} else {
			window.speechSynthesis.splitSentences = function(text) {
				let sentences = text.replace(/\.+/g,'.|').replace(/\?/g,'?|').replace(/\!/g,'!|').split("|");
				return _.chain(sentences).map(_.trim).compact().value();
			}
		}

		// Start listening to events
		if(_touchSupport()) {
			// Append button
			let button =_addTouchButton();
			button.addEventListener('touchstart', (e) => {
				alert('mouse up');
				let text = _getSelectedText();
				alert(text);

				_speak(text);
			});
		} else {
			window.addEventListener('mouseup', (e) => {
				let text = _getSelectedText();
				_speak(text);
			});
		}
	}

	function _addTouchButton() {
		let button = window.document.createElement('button');
		button.innerHTML = "Select some text and click here";
		button.style.height = '50px';
		window.document.body.appendChild(button);
		return button;
	}
	
	function _browserSupport() {
		return ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
	}

	function _touchSupport() {
		return ('ontouchstart' in window || navigator.maxTouchPoints);       // works on IE10/11 and Surface
	}

	function _getSelectedText() {
		rangy.getSelection().expand('word'); // expand selection to word so that we don't have half words
	  	return rangy.getSelection().toString();
	}

	function _stop() {
		window.speechSynthesis.cancel();
	}

	function _speak(msg) {
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

		// Stop current speech
		_stop();

		// Split into sentances (for better result and bug with some versions of chrome)
		let sentences = window.speechSynthesis.splitSentences(msg);
		_.forEach(sentences, (sentence) => {
			let utterance = new window.SpeechSynthesisUtterance();
			//utterance.voice = voices[10]; // Note: some voices don't support altering params
			utterance.volume = CONF.volume; // 0 to 1
			utterance.rate = CONF.rate; // 0.1 to 10
			utterance.pitch = CONF.pitch; //0 to 2
			utterance.text = sentence;
			utterance.lang = lang;

			/*
			utterance.onerror = (e) => {
	    	};
	    	utterance.onend = (e) => {
	    	};*/
    	
			window.speechSynthesis.speak(utterance);
		});
	}

	return {
		init: _init,
		browserSupport: _browserSupport
	}
})(window);

export default Speech;