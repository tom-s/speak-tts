import trim from 'lodash/trim'
import debounce from 'lodash/debounce'
import size from 'lodash/size'
import get from 'lodash/get'
import { splitSentences } from './utils'

class SpeakTTS {
  constructor(conf) {
    this.synthesisVoice = null
    this.currentVoices = []
    this.browserSupport = ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)
    this.onVoicesLoaded = get(conf, 'onVoicesLoaded', () => {})
    this.splitSentences = get(conf, 'splitSentences', true)
    const lang = get(conf, 'lang', 'en-US')
    const volume = get(conf, 'volume', 1)
    const rate = get(conf, 'rate', 1)
    const pitch = get(conf, 'pitch', 1)
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

    // Initialize values
    this.setLanguage(lang)
    this.setVoice(voice)
    this.setVolume(volume)
    this.setRate(rate)
    this.setPitch(pitch)
  }

  _initIOS(version) {
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
  }

  hasBrowserSupport() {
    return this.browserSupport
  }

  setVoice(voice) {
    let synthesisVoice
    const voices = speechSynthesis.getVoices()
    // set voice by ID/index
    if (typeof voice === 'number') {
      synthesisVoice = voices[i]
    }
    // set voice by name
    if (typeof voice === 'string') {
      synthesisVoice = voices.find((v) => v.name === voice)
    }
    // Set the voice in conf if found
    if (typeof voice === 'object') {
      synthesisVoice = voice
    }
    if(voice) {
      this.voice = voice
    }
    if(synthesisVoice) {
      this.synthesisVoice = synthesisVoice
    }
  }

  setLanguage(lang) {
    this.lang = lang
  }

  setVolume(volume) {
    this.volume = volume
  }

  setRate(rate) {
    this.rate = rate
  }

  setPitch(pitch) {
    this.pitch = pitch
  }

  speak(data) {
    const { text, onEnd, onError } = data
    const msg = trim(text)

    if(!msg || msg === '.') return // when click on empty space value is '.' for some weird reason
    const lang = this.lang  || 'en-US'

    // Get configured voice, or first for current language
    const voice = (lang => ( this.synthesisVoice
      ? this.synthesisVoice
      :  speechSynthesis.getVoices().find(voice => get(voice, 'lang', '').replace('_', '-') === lang) // handle android specificites
    ))(lang)

    // Stop current speech
    stop()

    // Split into sentances (for better result and bug with some versions of chrome)
    const sentences = this.splitSentences
      ? splitSentences(msg)
      : [msg]
    sentences.forEach((sentence, index) => {
      const isLast = index === size(sentences) - 1
      const utterance = new SpeechSynthesisUtterance()
      utterance.lang = lang
      utterance.volume = parseFloat(this.volume) // 0 to 1
      utterance.rate = parseFloat(this.rate) // 0.1 to 10
      utterance.pitch = parseFloat(this.pitch) //0 to 2
      utterance.text = sentence
      utterance.voice = voice

      if(!voice) {
        if(onError) onError({msg: 'no voice available'})
        return
      }

      utterance.onerror = (e) => {
        if(onError) onError(e)
      }

      utterance.onend = (e) => {
        if(onEnd && isLast) onEnd()
      }

      speechSynthesis.speak(utterance)
    })
  }

  stop() {
    speechSynthesis.cancel()
  }
}

export default SpeakTTS
