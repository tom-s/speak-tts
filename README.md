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

```bash
// Example with full conf
Speech.init({
	'onVoicesLoaded': (data) => {console.log('voices', data.voices)},
    'lang': 'en-GB', // specify en-GB language (no detection applied)
    'volume': 0.5,
    'rate': 0.8,
    'pitch': 0.8
})
```
Check browser support :

```bash
if(Speech.browserSupport()) {
	console.log("speech synthesis supported")
}
```

Read a text :

```bash
Speech.speak({
	text: 'Hello, how are you today ?',
	onError: (e) => {console.log('sorry an error occured.', e)}, // optionnal error callback
	onEnd: () => {console.log('your text has successfully been spoken.')} // optionnal onEnd callback
})
```

Set language (note that the language must be supported by the client browser) :

```bash
Speech.setLanguage('en-GB') // set language to english
Speech.setLanguage(null) // activate language autodetection
```

Stop talking:

```bash
Speech.stop()
```

## Supported languages
	"ar-SA" // arabic
	"cs-CZ" // czech
	"da-DK" // danish
	"de-DE" // german
	"el-GR" // greek
	"en-AU" // australian
	"en-GB" // english
	"en-IE"
	"en-US"
	"en-US"
	"en-ZA"
	"es-ES" // spanish
	"es-MX"
	"fi-FI" // finish
	"fr-CA"
	"fr-FR" // french
	"he-IL" // hebrew
	"hi-IN" // hindi
	"hu-HU" // hungarian
	"id-ID" // indonesian
	"it-IT" // italian
	"ja-JP" // japanese
	"ko-KR" // korean
	"nl-NL" // dutch
	"no-NO" // norwegian
	"pl-PL" // polish
	"pt-BR" // portuguese brazilian
	"pt-PT" // portuguese
	"ro-RO" // romanian
	"ru-RU" // russian
	"sk-SK" // slovak
	"sv-SE" // swedish
	"th-TH" // thai
	"tr-TR" // turkish
	"zh-CN" // chinese (S)
	"zh-HK" // chinese hong kong
	"zh-TW" // chinese (T'en-US';

## Full demo code (es6 example)

```bash
import Speech from 'speak-tts'

const _addVoicesList = (voices) => {
  const list = window.document.createElement('div')
  let html = '<h2>Available Voices</h2><select id="languages"><option value="">autodetect language</option>'
  voices.forEach((voice) => {
    html += '<option value="' + voice.lang + '"">' + voice.name + ' (' + voice.lang + ')</option>'
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
    Speech.speak({
      text: textarea.value
    })
  })
}

Speech.init({
  onVoicesLoaded: (data) => {
    console.log("loaded voices", data.voices)
    _addVoicesList(data.voices)
    _prepareSpeakButton()
    Speech.speak({
      text: 'Hello, how are you today ?'
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
