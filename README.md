Speech synthesis made easy - Browser based text to speech (TTS)
===

## Installation

```bash
npm install speak-tts
```

## Description

Speech synthesis (tts) for the browser with (optional) language detection. Based on browser SpeechSynthesis API, it improves it by handling some quirks and bugs of IOS/android devices and some chrome versions. Also split sentences into several speeches to make it sound more natural and provides additional callback functions. Work in Chrome, opera and Safari (including ios8 and ios9 devices). Tested successfully on Ipad and Android.
See browser support here : http://caniuse.com/#feat=speech-synthesis

## Demo

Here is a demo:
[Here](http://experiments.thomschell.com/speak-tts/demo/dist)

## Usage

Import the component :

```bash
import Speech from 'speak-tts' // es6
// var Speech = require('speak-tts') //if you use es5
```

Start the component :

```bash
Speech.init()
```

You can pass the following properties at init time:
- onVoicesLoaded: callback function triggered when voices are loaded (happens asynchronously)
- volume
- rate
- pitch
- lang : if you don't pass a language, the language of the given text will be automatically detected thanks to franc (https://github.com/wooorm/franc). If you pass a language, this will be used for all audio outputs (nevertheless the language of the selected text)
- voice : the voice to use. If you do not pass a voice, the first one available for `lang` will be used

```bash
// Example with full conf
Speech.init({
	'onVoicesLoaded': (data) => {console.log('voices', data.voices)},
    'lang': 'en-US', // specify en-US language (no detection applied)
    'volume': 0.5,
    'rate': 0.8,
    'pitch': 0.8,
    'voice': 'Samantha'
})
```
Check browser support :

```javascript
if(Speech.browserSupport()) {
	console.log("speech synthesis supported")
}
```

Read a text :

```javascript
Speech.speak({
	text: 'Hello, how are you today ?',
	onError: (e) => {console.log('sorry an error occurred.', e)}, // optionnal error callback
	onEnd: () => {console.log('your text has successfully been spoken.')} // optionnal onEnd callback
})
```

Set language (note that the language must be supported by the client browser) :

```javascript
Speech.setLanguage('en-US') // set language to US English
Speech.setLanguage(null) // activate language auto-detection
```

Set the voice (note that the voice must be supported by the client browser) :

```javascript
Speech.setVoice('Fiona') // set voice to 'Fiona'
```

Stop talking:

```javascript
Speech.stop()
```

## Supported languages
```
ar-SA
cs-CZ
da-DK
de-DE
el-GR
en
en-AU
en-GB
en-IE
en-IN
en-US
en-ZA
es-AR
es-ES
es-MX
es-US
fi-FI
fr-CA
fr-FR
he-IL
hi-IN
hu-HU
id-ID
it-IT
ja-JP
ko-KR
nb-NO
nl-BE
nl-NL
pl-PL
pt-BR
pt-PT
ro-RO
ru-RU
sk-SK
sv-SE
th-TH
tr-TR
zh-CN
zh-HK
zh-TW
```

## Supported Voices
```
Alex
Alice
Alva
Amelie
Anna
Carmit
Damayanti
Daniel
Diego
Ellen
Fiona
Fred
Ioana
Joana
Jorge
Juan
Kanya
Karen
Kyoko
Laura
Lekha
Luca
Luciana
Maged
Mariska
Mei-Jia
Melina
Milena
Moira
Monica
Nora
Paulina
Samantha
Sara
Satu
Sin-ji
Tessa
Thomas
Ting-Ting
Veena
Victoria
Xander
Yelda
Yuna
Yuri
Zosia
Zuzana
Google Deutsch
Google US English
Google UK English Female
Google UK English Male
Google español
Google español de Estados Unidos
Google français
Google हिन्दी
Google Bahasa Indonesia
Google italiano
Google 日本語
Google 한국의
Google Nederlands
Google polski
Google português do Brasil
Google русский
Google 普通话（中国大陆）
Google 粤語（香港）
Google 國語（臺灣）
```

## Full demo code (es6 example)

```javascript
import Speech from 'speak-tts'

const _addVoicesList = (voices) => {
	const list = window.document.createElement('div')
	let html = '<h2>Available Voices</h2><select id="languages"><option value="">autodetect language</option>'
	voices.forEach((voice) => {
		html += `<option value="${voice.lang}" data-name="${voice.name}">${voice.name} (${voice.lang})</option>`
	})
	list.innerHTML = html
	window.document.body.appendChild(list)
}

function _prepareSpeakButton() {
	const speakButton = document.getElementById('play')
	const textarea = document.getElementById('text')
	const languages = document.getElementById('languages')
	speakButton.addEventListener('click', () => {
		Speech.setLanguage(languages.value)
        Speech.setVoice(languages.options[languages.selectedIndex].dataset.name)
		Speech.speak({
			text: textarea.value,
			onEnd: () => {
				console.log('end of text')
			}
		})
	})
}

Speech.init({
	onVoicesLoaded: (data) => {
		console.log("loaded voices", data.voices)
		_addVoicesList(data.voices)
		_prepareSpeakButton()
		Speech.speak({
			text: 'Hello, how are you today ?',
			onEnd: () => {
				console.log('end of text')
			},
		})
	}
});

const text = (Speech.browserSupport()) ? 'Hurray, your browser supports speech synthesis' : "Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !"
document.getElementById("support").innerHTML = text
```

## Tests

These will be added soon. Please do not hesitate to add some !

## About the Author

I am a full-stack Javascript developer based in Lyon, France.

[Check out my website](http://www.thomschell.com)

## License

speak-tts is dual licensed under the MIT license and GPL.
For more information click [here](https://opensource.org/licenses/MIT).
