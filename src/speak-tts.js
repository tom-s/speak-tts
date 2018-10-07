import trim from 'lodash/trim'
import size from 'lodash/size'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isFinite from 'lodash/isFinite'
import { splitSentences, validateLocale } from './utils'
import  { iOSversion, iOS8voices, iOS9voices } from './ios'

class SpeakTTS {
  constructor() {
    this.browserSupport = ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)
    this.synthesisVoice = null
  }
  init(conf) {
    return new Promise((resolve, reject) => {
      if(!this.browserSupport) {
        reject('Your browser does not support Speech Synthesis')
      }
      this.splitSentences = get(conf, 'splitSentences', true)
      const lang = get(conf, 'lang')
      const volume = get(conf, 'volume')
      const rate = get(conf, 'rate')
      const pitch = get(conf, 'pitch')
      const voice = get(conf, 'voice')

      this._loadVoices()
        .then(voices => {
          // Initialize values if necessary
          lang && this.setLanguage(lang)
          voice && this.setVoice(voice)
          volume && this.setVolume(volume)
          rate && this.setRate(rate)
          pitch && this.setPitch(pitch)

          resolve({
            voices,
            lang: this.lang,
            voice: this.voice,
            volume: this.volume,
            rate: this.rate,
            pitch: this.pitch,
            browserSupport: this.browserSupport
          })
        }).catch(reject)
    })
  }

  _loadVoices() {
    const handlePromise = (resolve, reject) => {
      const voices = speechSynthesis.getVoices()
      if(isEmpty(voices)) {
        reject()
      } else {
        resolve(voices)
      }
    }

    return new Promise((resolve, reject) => {
      // If voices are already there, nothing to do
      const voices = speechSynthesis.getVoices()
      if(!isEmpty(voices)) {
        return resolve(voices)
      }

      // Async loading of voices
      if(speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          return handlePromise(resolve, reject)
        }
      } else {
        this._tryfallbackVoices()
          .finally(() => {
            return handlePromise(resolve, reject)
          })
      }
    })
  }

  _tryfallbackVoices() {
    // Try with a timeout
    const iosVersion = iOSversion()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
         // Sometimes IOS has no voice (bug), so we try to use cached voices instead
        if(isEmpty(speechSynthesis.getVoices())) {
          if(iosVersion) {
            delete speechSynthesis.getVoices
            speechSynthesis.getVoices = () => version >= 9
              ? iOS9voices
              : iOS8voices
            resolve()
          } else {
            reject()
          }
        }
      }, 100)
    })
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
    if(validateLocale(lang)) {
      this.lang = lang
    } else {
      throw 'Error setting language. Please verify your locale is BCP47 format (http://schneegans.de/lv/?tags=es-FR&format=text)'
    }
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
    rate = parseFloat(rate)
    if(isFinite(rate) && rate >= 0 && rate <= 10) {
      this.rate = rate
    } else {
      throw 'Error setting rate. Please verify your volume value is a number between 0 and 10.'
    }
  }

  setPitch(pitch) {
    pitch = parseFloat(pitch)
    if(isFinite(pitch) && pitch >= 0 && pitch <= 2) {
      this.pitch = pitch
    } else {
      throw 'Error setting pitch. Please verify your pitch value is a number between 0 and 2.'
    }
  }

  speak(data) {
    return new Promise((resolve, reject) => {
      const { text } = data
      const msg = trim(text)

      if(isNil(msg)) resolve()

      // Stop current speech
      this.stop()

      // Split into sentences (for better result and bug with some versions of chrome)
      const sentences = this.splitSentences
        ? splitSentences(msg)
        : [msg]
      sentences.forEach((sentence, index) => {
        const isLast = index === size(sentences) - 1
        const utterance = new SpeechSynthesisUtterance()
        if(this.synthesisVoice) utterance.voice = this.synthesisVoice
        if(this.lang) utterance.lang = this.lang
        if(this.volume) utterance.volume = this.volume // 0 to 1
        if(this.rate) utterance.rate = this.rate // 0.1 to 10
        if(this.pitch) utterance.pitch = this.pitch //0 to 2
        utterance.text = sentence
        utterance.onerror = reject
        utterance.onend = () => {
          if(isLast) resolve()
        }
        speechSynthesis.speak(utterance)
      })
    })
  }

  stop() {
    speechSynthesis.cancel()
  }
}

export default SpeakTTS
