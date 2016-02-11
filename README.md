Select and speak (text selection and speech synthesis) - Web based TTS
===

## Installation

```bash
npm install select-and-speak
```

## Description

Select (highlight) text in your browser and in order to have spoken by speech synthesis.
Only supports, french, german and english for now but lot more support will be added soon.

See browser support here : http://caniuse.com/#feat=speech-synthesis

## Demo

[Here](http://experiments.thomschell.com/select-and-speak/demo/dist)

## Usage

Import the component :

```bash
import Speech from './utils/speech.js';
```

Start the component :
```bash
Speech.init();
```

You can pass the following properties at init time:
- volume
- rate
- pitch
- lang : if you don't pass a language, the language of the selected text will be automatically detected thanks to franc (https://github.com/wooorm/franc). If you pass a language, this will be used for all audio outputs (nevertheless the language of the selected text)

```bash
// Example with full conf
Speech.init({
    'lang': 'en-UK',
    'volume': 0.5,
    'rate': 0.8,
    'pitch': 0.8
});
```

## Tests

These will be added soon. Please do not hesitate to add some !

## About the Author

I am a full-stack Javascript developer based in Lyon, France.

[Check out my website](http://www.thomschell.com)

## License

speech and speak is dual licensed under the MIT license and GPL.
For more information click [here](https://opensource.org/licenses/MIT).
