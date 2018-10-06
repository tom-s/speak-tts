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

const speech = new Speech({
	'volume': 0.5,
	'voice':'Google UK English Female',
  //'rate': 0.8,
    //'pitch': 'aaa',
		//'lang': 'en-US',
	onVoicesLoaded: (data) => {
		console.log("debug voicesLoaded !", data)
		_addVoicesList(data.voices)
		_prepareSpeakButton()
	}
})

function _prepareSpeakButton() {
	const speakButton = document.getElementById('play')
	const textarea = document.getElementById('text')
	const languages = document.getElementById('languages')
	speakButton.addEventListener('click', () => {
		speech.setLanguage(languages.value)
    speech.setVoice(languages.options[languages.selectedIndex].dataset.name)
		speech.speak({
			text: textarea.value,
			onEnd: () => {
				console.log('end of text')
			}
		})
	})
}




const text = (speech.hasBrowserSupport()) ? 'Hurray, your browser supports speech synthesis' : "Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !"
document.getElementById("support").innerHTML = text
