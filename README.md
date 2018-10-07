Speech synthesis made easy - Browser based text to speech (TTS)
===

## Installation

```bash
npm install speak-tts
```

## Description

Speech synthesis (tts) for the browser with (optional) language detection. Based on browser SpeechSynthesis API, it improves it by providing a Promise-base API and handling some quirks and bugs of IOS/android devices and some chrome versions. It also split sentences into several speeches to make it sound more natural and provides additional callback functions. Work in Chrome, opera and Safari (including ios8 and ios9 devices). Tested successfully on Ipad and Android.
See browser support here : http://caniuse.com/#feat=speech-synthesis

## Demo

Here is a demo:
[Here](http://experiments.thomschell.com/speak-tts/demo/dist)

## Usage

Import the library :

```javascript
import Speech from 'speak-tts' // es6
// var Speech = require('speak-tts') //if you use es5
```

```
Check for browser support :

```javascript
const speech = new Speech()
if(speech.browserSupport()) {
	console.log("speech synthesis supported")
}
```

Init the speech component :

```javascript
const speech = new Speech()
speech.init().then((data) => {
	console.log("Speech is ready", data)
}).catch(e => {
	console.error("An error occured while initializing : ", e)
})
```

You can pass the following properties at init time:
- volume
- lang
- rate
- pitch
- voice : the voice to use
- splitSentances

```javascript
// Example with full conf
Speech.init({
    'volume': 0.5,
		'lang': 'en-GB',
		'rate': 1,
		'pitch': 1,
		'voice':'Google UK English Male',
		'splitSentences': true
})
```

Read a text :

```javascript
speech.speak({
	text: 'Hello, how are you today ?',
}).then(() => {
	console.log("Success !")
}).catch(e => {
	console.error("An error occurred :", e)
})
```

Set language (note that the language must be supported by the client browser) :

```javascript
Speech.setLanguage('en-US') // set language to US English
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
