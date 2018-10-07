Speech synthesis made easy - Browser based text to speech (TTS)
===

## Installation

```bash
npm install speak-tts
```

## Description

Speech synthesis (tts) for the browser. Based on browser Web speech API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), it improves it by :
- providing a Promise-base API (the init() and speak() methods respectively returns a Promise)
- handling the fact that Chrome load voices in an asynchronous manner when others browsers don't
- handling some quirks and bugs of IOS/android devices and some chrome/firefox versions 
- splitting sentences into several speeches to make it sound more natural (can be disabled)
- throwing specific exceptions: explicit exceptions will be thrown if you pass parameters with incompatible values to any of the methods 

Work in Chrome, opera and Safari (including ios8 and ios9 devices). Tested successfully on Ipad and Android.
See browser support here : http://caniuse.com/#feat=speech-synthesis

## Demo

Here is a demo:
[Here](https://codesandbox.io/s/w7m96rrp2l)

## Usage

Import the library :

```javascript
import Speech from 'speak-tts' // es6
// var Speech = require('speak-tts') //if you use es5
```

Check for browser support :

```javascript
const speech = new Speech() // will throw an exception if not browser supported
if(speech.browserSupport()) { // returns a boolean
	console.log("speech synthesis supported")
}
```

Init the speech component :

```javascript
const speech = new Speech()
speech.init().then((data) => {
	// The "data" object contains the list of available voices and the voice synthesis params
	console.log("Speech is ready, voices are available", data)
}).catch(e => {
	console.error("An error occured while initializing : ", e)
})
```

You can pass the following properties to the init function:
- volume //default 1
- lang // default is determined by your browser if not provided
- voice : the voice to use // default is chosen by your browser if not provided
- rate // default is determined by your browser if not provided (=1)
- pitch //  default is chosen by your browser if not provided (=1)
- splitSentences // default true

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
Speech.setLanguage('en-US')
```

Set the voice (note that the voice must be supported by the client browser) :

```javascript
Speech.setVoice('Fiona')
```

Set the rate :

```javascript
Speech.setRate(1) 
```

Set the volume :

```javascript
Speech.setVolume(1) 
```

Stop talking in progress:

```javascript
Speech.stop()
```

## Supported languages (list might not be up to date)
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

## Supported Voices (list might not be up to date)
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

## Tests

These will be added soon. Please do not hesitate to add some !

## About the Author

I am a full-stack Javascript developer based in Lyon, France.

[Check out my website](http://www.thomschell.com)

## License

speak-tts is dual licensed under the MIT license and GPL.
For more information click [here](https://opensource.org/licenses/MIT).
