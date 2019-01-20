Speech synthesis made easy - Browser based text to speech (TTS)
===

## Installation

```bash
npm install speak-tts
```

## Description

Speech synthesis (tts) for the browser. Wrapping the browser Speech Synthesis API (https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) and providing a similar interface, it improves it by :
- giving a Promise-base API (the init() and speak() methods respectively returns a Promise)
-> init() get resolved once voices are loaded
-> speak() get resolved once the full text has been spoken
- handling the fact that Chrome load voices in an asynchronous manner when others browsers don't
-> onvoiceschanged listener gets triggered in all browsers
- handling some quirks and bugs of IOS/android devices and some chrome/firefox versions 
- splitting sentences into several speeches to make it sound more natural, especially for older versions of Chrome (can be disabled)
- throwing specific exceptions: explicit exceptions will be thrown if you pass parameters with incompatible values to any of the methods

Work in Chrome, opera and Safari (including ios8 and ios9 devices). Tested successfully on Ipad and Android.
See browser support here : http://caniuse.com/#feat=speech-synthesis

## Demo

Here is a demo:
[Here](https://codesandbox.io/s/rmloxx60q4)

## Usage

Import the library :

```javascript
import Speech from 'speak-tts' // es6
// var Speech = require('speak-tts') //if you use es5
```

Check for browser support :

```javascript
const speech = new Speech() // will throw an exception if not browser supported
if(speech.hasBrowserSupport()) { // returns a boolean
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
- rate // default 1
- pitch //  default 1
- splitSentences // default true
- listeners // object of listeners to attach to the SpeechSynthesis object

```javascript
// Example with full conf 
Speech.init({
   	'volume': 1,
		'lang': 'en-GB',
		'rate': 1,
		'pitch': 1,
		'voice':'Google UK English Male',
		'splitSentences': true,
		'listeners': {
			'onvoiceschanged': (voices) => {
				console.log("Event voiceschanged", voices)
			}
		}
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

You can pass the following properties to the speak function:
- text: text to be spoken
- queue // default true: if set to false, the current speech utterance will be interrupted
- listeners // object of listeners to attach to the SpeechSynthesisUtterance (see list on https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)

Read a text (example with all params):

```javascript
speech.speak({
	text: 'Hello, how are you today ?',
	queue: false // current speech will be interrupted,
	listeners: {
		onstart: () => {
			console.log("Start utterance")
		},
		onend: () => {
			console.log("End utterance")
		},
		onresume: () => {
			console.log("Resume utterance")
		},
		onboundary: (event) => {
			console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.')
		}
	}
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
Speech.setVoice('Fiona') // you can pass a SpeechSynthesisVoice as returned by the init() function or just its name
```

Set the rate :

```javascript
Speech.setRate(1) 
```

Set the volume :

```javascript
Speech.setVolume(1) 
```

Set the pitch :

```javascript
Speech.setPitch(1) 
```

Pause talking in progress:

```javascript
Speech.pause()
```

Resume talking in progress:

```javascript
Speech.resume()
```

Cancel talking in progress:

```javascript
Speech.cancel()
```

Get boolean indicating if the utterance queue contains as-yet-unspoken utterances:

```javascript
Speech.pending()
```

Get boolean indicating if talking is paused:

```javascript
Speech.paused()
```

Get boolean indicating if talking is in progress:

```javascript
Speech.speaking()
```

## Supported languages (list may be incomplete and depends on your browser)
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

## Tests

These will be added soon. Please do not hesitate to add some !

## About the Author

I am a full-stack Javascript developer based in Lyon, France.

[Check out my website](http://www.thomschell.com)

## License

speak-tts is dual licensed under the MIT license and GPL.
For more information click [here](https://opensource.org/licenses/MIT).
