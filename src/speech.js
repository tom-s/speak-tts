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

	 //Fallback cache voices for ios
	// iOS 8
	const iOS8voices = [
	    {name: "pt-BR", voiceURI: "pt-BR", lang: "pt-BR", localService: true, default: true},
	    {name: "fr-CA", voiceURI: "fr-CA", lang: "fr-CA", localService: true, default: true},
	    {name: "sk-SK", voiceURI: "sk-SK", lang: "sk-SK", localService: true, default: true},
	    {name: "th-TH", voiceURI: "th-TH", lang: "th-TH", localService: true, default: true},
	    {name: "ro-RO", voiceURI: "ro-RO", lang: "ro-RO", localService: true, default: true},
	    {name: "no-NO", voiceURI: "no-NO", lang: "no-NO", localService: true, default: true},
	    {name: "fi-FI", voiceURI: "fi-FI", lang: "fi-FI", localService: true, default: true},
	    {name: "pl-PL", voiceURI: "pl-PL", lang: "pl-PL", localService: true, default: true},
	    {name: "de-DE", voiceURI: "de-DE", lang: "de-DE", localService: true, default: true},
	    {name: "nl-NL", voiceURI: "nl-NL", lang: "nl-NL", localService: true, default: true},
	    {name: "id-ID", voiceURI: "id-ID", lang: "id-ID", localService: true, default: true},
	    {name: "tr-TR", voiceURI: "tr-TR", lang: "tr-TR", localService: true, default: true},
	    {name: "it-IT", voiceURI: "it-IT", lang: "it-IT", localService: true, default: true},
	    {name: "pt-PT", voiceURI: "pt-PT", lang: "pt-PT", localService: true, default: true},
	    {name: "fr-FR", voiceURI: "fr-FR", lang: "fr-FR", localService: true, default: true},
	    {name: "ru-RU", voiceURI: "ru-RU", lang: "ru-RU", localService: true, default: true},
	    {name: "es-MX", voiceURI: "es-MX", lang: "es-MX", localService: true, default: true},
	    {name: "zh-HK", voiceURI: "zh-HK", lang: "zh-HK", localService: true, default: true},
	    {name: "sv-SE", voiceURI: "sv-SE", lang: "sv-SE", localService: true, default: true},
	    {name: "hu-HU", voiceURI: "hu-HU", lang: "hu-HU", localService: true, default: true},
	    {name: "zh-TW", voiceURI: "zh-TW", lang: "zh-TW", localService: true, default: true},
	    {name: "es-ES", voiceURI: "es-ES", lang: "es-ES", localService: true, default: true},
	    {name: "zh-CN", voiceURI: "zh-CN", lang: "zh-CN", localService: true, default: true},
	    {name: "nl-BE", voiceURI: "nl-BE", lang: "nl-BE", localService: true, default: true},
	    {name: "en-GB", voiceURI: "en-GB", lang: "en-GB", localService: true, default: true},
	    {name: "ar-SA", voiceURI: "ar-SA", lang: "ar-SA", localService: true, default: true},
	    {name: "ko-KR", voiceURI: "ko-KR", lang: "ko-KR", localService: true, default: true},
	    {name: "cs-CZ", voiceURI: "cs-CZ", lang: "cs-CZ", localService: true, default: true},
	    {name: "en-ZA", voiceURI: "en-ZA", lang: "en-ZA", localService: true, default: true},
	    {name: "en-AU", voiceURI: "en-AU", lang: "en-AU", localService: true, default: true},
	    {name: "da-DK", voiceURI: "da-DK", lang: "da-DK", localService: true, default: true},
	    {name: "en-US", voiceURI: "en-US", lang: "en-US", localService: true, default: true},
	    {name: "en-IE", voiceURI: "en-IE", lang: "en-IE", localService: true, default: true},
	    {name: "he-IL", voiceURI: "he-IL", lang: "he-IL", localService: true, default: true},
	    {name: "hi-IN", voiceURI: "hi-IN", lang: "hi-IN", localService: true, default: true},
	    {name: "el-GR", voiceURI: "el-GR", lang: "el-GR", localService: true, default: true},
	    {name: "ja-JP", voiceURI: "ja-JP", lang: "ja-JP", localService: true, default: true}
	];
	// IOS9
	const iOS9voices = [
		  { name: "Maged", voiceURI: "com.apple.ttsbundle.Maged-compact", lang: "ar-SA", localService: true, "default": true },
		  { name: "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact", lang: "cs-CZ", localService: true, "default": true },
		  { name: "Sara", voiceURI: "com.apple.ttsbundle.Sara-compact", lang: "da-DK", localService: true, "default": true },
		  { name: "Anna", voiceURI: "com.apple.ttsbundle.Anna-compact", lang: "de-DE", localService: true, "default": true },
		  { name: "Melina", voiceURI: "com.apple.ttsbundle.Melina-compact", lang: "el-GR", localService: true, "default": true },
		  { name: "Karen", voiceURI: "com.apple.ttsbundle.Karen-compact", lang: "en-AU", localService: true, "default": true },
		  { name: "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact", lang: "en-GB", localService: true, "default": true },
		  { name: "Moira", voiceURI: "com.apple.ttsbundle.Moira-compact", lang: "en-IE", localService: true, "default": true },
		  { name: "Samantha (Enhanced)", voiceURI: "com.apple.ttsbundle.Samantha-premium", lang: "en-US", localService: true, "default": true },
		  { name: "Samantha", voiceURI: "com.apple.ttsbundle.Samantha-compact", lang: "en-US", localService: true, "default": true },
		  { name: "Tessa", voiceURI: "com.apple.ttsbundle.Tessa-compact", lang: "en-ZA", localService: true, "default": true },
		  { name: "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact", lang: "es-ES", localService: true, "default": true },
		  { name: "Paulina", voiceURI: "com.apple.ttsbundle.Paulina-compact", lang: "es-MX", localService: true, "default": true },
		  { name: "Satu", voiceURI: "com.apple.ttsbundle.Satu-compact", lang: "fi-FI", localService: true, "default": true },
		  { name: "Amelie", voiceURI: "com.apple.ttsbundle.Amelie-compact", lang: "fr-CA", localService: true, "default": true },
		  { name: "Thomas", voiceURI: "com.apple.ttsbundle.Thomas-compact", lang: "fr-FR", localService: true, "default": true },
		  { name: "Carmit", voiceURI: "com.apple.ttsbundle.Carmit-compact", lang: "he-IL", localService: true, "default": true },
		  { name: "Lekha", voiceURI: "com.apple.ttsbundle.Lekha-compact", lang: "hi-IN", localService: true, "default": true },
		  { name: "Mariska", voiceURI: "com.apple.ttsbundle.Mariska-compact", lang: "hu-HU", localService: true, "default": true },
		  { name: "Damayanti", voiceURI: "com.apple.ttsbundle.Damayanti-compact", lang: "id-ID", localService: true, "default": true },
		  { name: "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", lang: "it-IT", localService: true, "default": true },
		  { name: "Kyoko", voiceURI: "com.apple.ttsbundle.Kyoko-compact", lang: "ja-JP", localService: true, "default": true },
		  { name: "Yuna", voiceURI: "com.apple.ttsbundle.Yuna-compact", lang: "ko-KR", localService: true, "default": true },
		  { name: "Ellen", voiceURI: "com.apple.ttsbundle.Ellen-compact", lang: "nl-BE", localService: true, "default": true },
		  { name: "Xander", voiceURI: "com.apple.ttsbundle.Xander-compact", lang: "nl-NL", localService: true, "default": true },
		  { name: "Nora", voiceURI: "com.apple.ttsbundle.Nora-compact", lang: "no-NO", localService: true, "default": true },
		  { name: "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact", lang: "pl-PL", localService: true, "default": true },
		  { name: "Luciana", voiceURI: "com.apple.ttsbundle.Luciana-compact", lang: "pt-BR", localService: true, "default": true },
		  { name: "Joana", voiceURI: "com.apple.ttsbundle.Joana-compact", lang: "pt-PT", localService: true, "default": true },
		  { name: "Ioana", voiceURI: "com.apple.ttsbundle.Ioana-compact", lang: "ro-RO", localService: true, "default": true },
		  { name: "Milena", voiceURI: "com.apple.ttsbundle.Milena-compact", lang: "ru-RU", localService: true, "default": true },
		  { name: "Laura", voiceURI: "com.apple.ttsbundle.Laura-compact", lang: "sk-SK", localService: true, "default": true },
		  { name: "Alva", voiceURI: "com.apple.ttsbundle.Alva-compact", lang: "sv-SE", localService: true, "default": true },
		  { name: "Kanya", voiceURI: "com.apple.ttsbundle.Kanya-compact", lang: "th-TH", localService: true, "default": true },
		  { name: "Yelda", voiceURI: "com.apple.ttsbundle.Yelda-compact", lang: "tr-TR", localService: true, "default": true },
		  { name: "Ting-Ting", voiceURI: "com.apple.ttsbundle.Ting-Ting-compact", lang: "zh-CN", localService: true, "default": true },
		  { name: "Sin-Ji", voiceURI: "com.apple.ttsbundle.Sin-Ji-compact", lang: "zh-HK", localService: true, "default": true },
		  { name: "Mei-Jia", voiceURI: "com.apple.ttsbundle.Mei-Jia-compact", lang: "zh-TW", localService: true, "default": true }
		];

	// For polyfill
	let audio = null;

	function _iOSversion() {
	    if (/(iPhone|iPad|iPod)/.test(navigator.platform)) {
	        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	        return parseInt(v[1], 10);
	    }
	  return false;
	}

	function _init(conf) {
		// Import conf
		if(conf) CONF =_.merge(CONF, conf);

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
			
			// On Chrome, voices are loaded asynchronously
			if ('onvoiceschanged' in window.speechSynthesis) {
    			speechSynthesis.onvoiceschanged = _addVoicesList;
			} else {
				var iosVersion = _iOSversion();
				alert('IOS version' + iosVersion);

				if(iosVersion) {
					_initIOS(iosVersion);
				}
			}
		}

		// Start listening to events
		if(_touchSupport()) {
			// Append button
			let button =_addTouchButton();
			button.addEventListener('click', (e) => {
				let text = _getSelectedText();
				_speak(text);
			});
		} else {
			window.addEventListener('mouseup', (e) => {
				let text = _getSelectedText();
				_speak(text);
				e.preventDefault();
			});
		}		
	}

	function _addVoicesList() {
		let list = window.document.createElement('div');
		list.innerHTML += '<h2>Voices</h2><p>';
		var voices = window.speechSynthesis.getVoices();
		_.forEach(voices, (voice) => {
			list.innerHTML += voice.name + ' (' + voice.lang + ')' + ' ';
		});
		list.innerHTML += '</p>';
		window.document.body.appendChild(list);
	}

	function _initIOS(version) {
		// Sometimes IOS has no voice (bug), so we try to handle it
		if(version >= 9) {
			if(window.speechSynthesis.getVoices().length === 0) {
				alert('use ios9 cached voices');
				delete window.speechSynthesis.getVoices;
				window.speechSynthesis.getVoices = () => iOS9voices; // use cached voices
				alert(window.speechSynthesis.getVoices().length + 'voices');
			}
		} else if(version >= 8) {
			// Try with a timeout
			setTimeout(() => {
				if(window.speechSynthesis.getVoices().length === 0) {
					alert('use ios8 cached voices');
					delete window.speechSynthesis.getVoices;
					window.speechSynthesis.getVoices = () => iOS8voices; // use cached voices	
				}
			}, 100);
		}

		_addVoicesList();

		// if not 8 or 7, not worth trying anything
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
		msg = _.trim(msg);
		if(!msg || msg === '.') return; // when click on empty space value is '.' for some weird reason
		var lang = (() => {
			if(CONF.lang) return CONF.lang;
			var flang = franc(msg, {'whitelist' : ['eng', 'fra', 'deu']});
			switch(flang) {
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
		alert('find voice for language ' + lang + ' in results' + window.speechSynthesis.getVoices().length);
		_.forEach(sentences, (sentence) => {
			let utterance = new window.SpeechSynthesisUtterance();
			let voice = _.find(window.speechSynthesis.getVoices(), (voice) => { 
				return voice.lang === lang;
			});
			utterance.lang = lang;
			utterance.volume = parseFloat(CONF.volume); // 0 to 1
			utterance.rate = parseFloat(CONF.rate); // 0.1 to 10
			utterance.pitch = parseFloat(CONF.pitch); //0 to 2
			utterance.text = sentence;

			if(voice) {
				alert('use voice' + voice.name);
				utterance.voice = voice;
			}

			/*
			utterance.onerror = (e) => {
				alert('error');
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