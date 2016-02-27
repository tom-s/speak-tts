Speech synthesis - Browser based TTS
===

## Installation

```bash
npm install speak-tts
```

## Description

Speech synthesis (tts) with (optionnal) language detection. Based on browser SpeechSynthesis API, it improves it by handling the quirks and bugs of IOS devices and some chrome versions. Work in Chrome, opera and Safari (including ios8 and ios9 devices such as the ipad)
See browser support here : http://caniuse.com/#feat=speech-synthesis

## Demo

Here is a demo of my select and speak module that uses speak-tts for speech synthesis.
[Here](http://experiments.thomschell.com/select-and-speak/demo/dist)

## Usage

Import the component :

```bash
import Speech from 'speech-tts';
```

Start the component :

```bash
Speech.init();
```

You can pass the following properties at init time:
- volume
- rate
- pitch
- lang : if you don't pass a language, the language of the given text will be automatically detected thanks to franc (https://github.com/wooorm/franc). If you pass a language, this will be used for all audio outputs (nevertheless the language of the selected text)

```bash
// Example with full conf
Speech.init({
    'lang': 'en-GB', // force en-GB language (no detection applied)
    'volume': 0.5,
    'rate': 0.8,
    'pitch': 0.8
});
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
	onError:  function() {console.log('sorry an error occured.')}, // optionnal error callback
	onEnd: function() {console.log('your text has successfully been spoken.')} // optionnal onEnd callback
});
```

Stop talking:

```bash
Speech.stop();
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

## Tests

These will be added soon. Please do not hesitate to add some !

## About the Author

I am a full-stack Javascript developer based in Lyon, France.

[Check out my website](http://www.thomschell.com)

## License

speech and speak is dual licensed under the MIT license and GPL.
For more information click [here](https://opensource.org/licenses/MIT).
