import Speech from '../src/speak-tts.js'

const _addVoicesList = (voices) => {
	const list = window.document.createElement('div')
	let html = '<h2>Available Voices</h2><select id="languages"><option value="">autodetect language</option>'
	voices.forEach((voice) => {
		html += `<option value="${voice.lang}" data-name="${voice.name}">${voice.name} (${voice.lang})</option>`
	})
	list.innerHTML = html
	window.document.body.appendChild(list)
}

function _init() {
	const speech = new Speech()
	speech.init({
		'volume': 0.5,
		'lang': 'en-GB',
		'rate': 1,
		'pitch': 1,
		//'voice':'Google UK English Male',
		//'splitSentences': false
	}).then((data) => {
		console.log("Speech is ready", data)
		_addVoicesList(data.voices)
		_prepareSpeakButton(speech)
	}).catch(e => {
		console.error("An error occured while initializing : ", e)
	})
	const text = (speech.hasBrowserSupport()) ? 'Hurray, your browser supports speech synthesis' : "Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !"
	document.getElementById("support").innerHTML = text
}

function _prepareSpeakButton(speech) {
	const speakButton = document.getElementById('play')
	const textarea = document.getElementById('text')
	const languages = document.getElementById('languages')
	speakButton.addEventListener('click', () => {
		const language = languages.value
		const voice = languages.options[languages.selectedIndex].dataset.name
		if(language) speech.setLanguage(languages.value)
    if(voice) speech.setVoice(voice)
		speech.speak({
			text: textarea.value,
		}).then(() => {
			console.log("Success !")
		}).catch(e => {
			console.error("An error occurred :", e)
		})
	})
}

_init()
