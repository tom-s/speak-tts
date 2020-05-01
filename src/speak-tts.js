import { splitSentences, splitPhrases, validateLocale, isString, size, isNan, isNil, isObject, trim } from './utils'

import  { iOSversion, filterIOSVoices } from './ios'

class SpeakTTS {
  constructor() {
    this.browserSupport = ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)
    this.synthesisVoice = null
  }

  init(conf = {}) {
    return new Promise((resolve, reject) => {
      if(!this.browserSupport) {
        reject('Your browser does not support Speech Synthesis')
      }
      const listeners = isNil(conf.listeners) ? {} : conf.listeners
      const splitSentences = isNil(conf.splitSentences) ? true : conf.splitSentences
      const splitPhrases = isNil(conf.splitPhrases) ? true : conf.splitPhrases
      const lang = isNil(conf.lang) ? undefined : conf.lang
      const volume = isNil(conf.volume) ? 1 : conf.volume
      const rate = isNil(conf.rate) ? 1 : conf.rate
      const pitch = isNil(conf.pitch) ? 1 : conf.pitch
      const voice = isNil(conf.voice) ? undefined : conf.voice

      // Attach event listeners
      Object.keys(listeners).forEach(listener => {
        const fn = listeners[listener]
        const newListener = (data) => {
          fn && fn(data)
        }
        if(listener !== 'onvoiceschanged') {
          speechSynthesis[listener] = newListener
        }
      })

      this._loadVoices()
        .then(voices => {
          const iosVersion = iOSversion()

          if (iosVersion) {
            // iOS does not allow you to select all of the voices it claims 
            // to have.  You only get one per locale.
            voices = filterIOSVoices(voices)
          }

          // Handle callback onvoiceschanged by hand
          listeners['onvoiceschanged'] && listeners['onvoiceschanged'](voices)

          // Initialize values if necessary
          !isNil(lang) && this.setLanguage(lang)
          !isNil(voice) && this.setVoice(voice)
          !isNil(volume) && this.setVolume(volume)
          !isNil(rate) && this.setRate(rate)
          !isNil(pitch) && this.setPitch(pitch)
          !isNil(splitSentences) && this.setSplitSentences(splitSentences)
          !isNil(splitPhrases) && this.setSplitPhrases(splitPhrases)

          resolve({
            voices,
            lang: this.lang,
            voice: this.voice,
            volume: this.volume,
            rate: this.rate,
            pitch: this.pitch,
            splitSentences: this.splitSentences,
            splitPhrases: this.splitPhrases,
            browserSupport: this.browserSupport
          })
        }).catch(e => {
          reject(e)
        })
    })
  }

  _fetchVoices() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const voices = speechSynthesis.getVoices()
        if(size(voices) > 0) {
          return resolve(voices)
        } else {
          return reject("Could not fetch voices")
        }
      }, 100)
    })
  }

  _loadVoices(remainingAttempts = 10) {
    return this._fetchVoices().catch(error => {
      if (remainingAttempts === 0) throw error
      return this._loadVoices(remainingAttempts - 1)
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
    lang = lang.replace('_', '-') // some Android versions seem to ignore BCP 47 and use an underscore character in language tag
    if(validateLocale(lang)) {
      this.lang = lang
    } else {
      throw 'Error setting language. Please verify your locale is BCP47 format (http://schneegans.de/lv/?tags=es-FR&format=text)'
    }
  }

  setVolume(volume) {
    volume = parseFloat(volume)
    if(!isNan(volume) && volume >= 0 && volume <= 1) {
      this.volume = volume
    } else {
      throw 'Error setting volume. Please verify your volume value is a number between 0 and 1.'
    }
  }

  setRate(rate) {
    rate = parseFloat(rate)
    if(!isNan(rate) && rate >= 0 && rate <= 10) {
      this.rate = rate
    } else {
      throw 'Error setting rate. Please verify your volume value is a number between 0 and 10.'
    }
  }

  setPitch(pitch) {
    pitch = parseFloat(pitch)
    if(!isNan(pitch) && pitch >= 0 && pitch <= 2) {
      this.pitch = pitch
    } else {
      throw 'Error setting pitch. Please verify your pitch value is a number between 0 and 2.'
    }
  }

  setSplitSentences(splitSentences) {
    this.splitSentences = splitSentences
  }

  setSplitPhrases(splitPhrases) {
    this.splitPhrases = splitPhrases
  }

  speak(data) {
    return new Promise((resolve, reject) => {
      const { text, listeners = {}, queue = true } = data
      const msg = trim(text)

      if(isNil(msg)) resolve()

      // Stop current speech
      !queue && this.cancel()

      // Split into sentences (for better result and bug with some versions of chrome)
      const utterances = []

      // Always split by phrases if it is true.
      // Only split by sentences if splitSentences == true && splitPhrases == false
      const sentences = this.splitPhrases 
        ? splitPhrases(msg) 
        : this.splitSentences
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

        // Attach event listeners
        Object.keys(listeners).forEach(listener => {
          const fn = listeners[listener]
          const newListener = (data) => {
            fn && fn(data)
            if(listener === 'onerror') {
              reject({
                utterances,
                lastUtterance: utterance,
                error: data
              })
            }
            if(listener === 'onend') {
              if(isLast) resolve({
                utterances,
                lastUtterance: utterance
              })
            }
          }
          utterance[listener] = newListener
        })
        utterances.push(utterance)
        speechSynthesis.speak(utterance)
      })
    })
  }

  pending() {
    return speechSynthesis.pending
  }

  paused() {
    return speechSynthesis.paused
  }

  speaking() {
    return speechSynthesis.speaking
  }

  pause() {
    speechSynthesis.pause()
  }

  resume() {
    speechSynthesis.resume()
  }

  cancel() {
    speechSynthesis.cancel()
  }
}

export default SpeakTTS
