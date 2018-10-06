import trim from 'lodash/trim'
import debounce from 'lodash/debounce'
import size from 'lodash/size'
import get from 'lodash/get'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isFinite from 'lodash/isFinite'
import { splitSentences } from './utils'

class SpeakTTS {
  constructor(conf) {
    try {
      this.synthesisVoice = null
      this.currentVoices = []
      this.browserSupport = ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)
      this.onVoicesLoaded = get(conf, 'onVoicesLoaded', () => {})
      this.splitSentences = get(conf, 'splitSentences', true)
      const lang = get(conf, 'lang')
      const volume = get(conf, 'volume')
      const rate = get(conf, 'rate')
      const pitch = get(conf, 'pitch')
      const voice = get(conf, 'voice')
     
      // On Chrome, voices are loaded asynchronously
      if ('onvoiceschanged' in speechSynthesis) {
        speechSynthesis.onvoiceschanged = debounce(() => {
          const voices = speechSynthesis.getVoices()
          if(size(this.currentVoices) !== size(voices)) {
            this.currentVoices = voices
            this.onVoicesLoaded && this.onVoicesLoaded({
                voices
              })
            }
  
          }, 300)
      } else {
        const iosVer = iOSversion()
        if(iosVer) {
          this._initIOS(iosVer)
        }
      }
  
      // Initialize values if necessary
      lang && this.setLanguage(lang)
      voice && this.setVoice(voice)
      volume && this.setVolume(volume)
      rate && this.setRate(rate)
      pitch && this.setPitch(pitch)
    } catch(e) {
      
    }
  }

  _initIOS(version) {
    try {
      // Sometimes IOS has no voice (bug), so we try to handle it
      if(version >= 9) {
        if(size(speechSynthesis.getVoices()) === 0) {
          delete speechSynthesis.getVoices
          speechSynthesis.getVoices = () => iOS9voices // use cached voices
        }
        this.onVoicesLoaded && this.onVoicesLoaded({
          voices: speechSynthesis.getVoices()
        })
      } else if(version >= 8) {
        // Try with a timeout
        setTimeout(() => {
          if(size(speechSynthesis.getVoices()) === 0) {
            delete speechSynthesis.getVoices
            speechSynthesis.getVoices = () => iOS8voices // use cached voices
          }
          this.onVoicesLoaded && this.onVoicesLoaded({
            voices: speechSynthesis.getVoices()
          })
        }, 100)
      }
      // if not 8 or 7, not worth trying anything
    } catch(e) {
      throw(e)
    }
  }

  hasBrowserSupport() {
    return this.browserSupport
  }

  setVoice(voice) {
    let synthesisVoice
    const voices = speechSynthesis.getVoices()
    // set voice by name
    if (isString(voice)) {
      synthesisVoice = voices.find((v) => v.name === voice)
    }
    // Set the voice in conf if found
    if (isObject(voice)) {
      synthesisVoice = voice
    }
    if(synthesisVoice) {
      this.synthesisVoice = synthesisVoice
    } else {
      throw 'Error setting voice. The voice you passed is not valid or the voices have not been loaded yet.'
    }
  }

  setLanguage(lang) {
    this.lang = lang
  }

  setVolume(volume) {
      volume = parseFloat(volume)
      if(isFinite(volume) && volume >= 0 && volume <= 1) {
        this.volume = volume
      } else {
        throw 'Error setting volume. Please verify your volume value is a number between 0 and 1.'
      }
  }

  setRate(rate) {
    try {
      this.rate = parseFloat(rate)
    } catch(e) {
      throw 'Error setting rate. Please verify your rate value is valid.'
    }
  }

  setPitch(pitch) {
    try {
      this.pitch = parseFloat(pitch)
    } catch(e) {
      console.log("debug throw !!!")
      throw 'Error setting pitch. Please verify your pitch value.'
    }
  }

  speak(data) {
    const { text, onEnd } = data
    const msg = trim(text)

    if(!msg || msg === '.') return // when message is an empty space value is '.' for some weird reason

    // Stop current speech
    this.stop()

    // Split into sentences (for better result and bug with some versions of chrome)
    const sentences = this.splitSentences
      ? splitSentences(msg)
      : [msg]
    sentences.forEach((sentence, index) => {
      const isLast = index === size(sentences) - 1
      const utterance = new SpeechSynthesisUtterance()
      if(this.voice) utterance.voice = this.synthesisVoice
      if(this.lang) utterance.lang = this.lang
      if(this.volume) utterance.volume = this.volume // 0 to 1
      if(this.rate) utterance.rate = this.rate // 0.1 to 10
      if(this.pitch) utterance.pitch = this.pitch //0 to 2
      utterance.text = sentence

      utterance.onerror = (e) => {
       throw(e)
      }

      utterance.onend = (e) => {
        if(onEnd && isLast) onEnd()
      }

      speechSynthesis.speak(utterance)
    })
  }

  stop() {
    try {
      speechSynthesis.cancel()
    } catch(e) {
      throw "Error stopping current utterance"
    }
  }
}

export default SpeakTTS
