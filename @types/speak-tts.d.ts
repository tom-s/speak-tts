declare class Speech {
	constructor();

	hasBrowserSupport(): boolean;

	init(options: {
    onVoicesLoaded?: (data: {
      voices: Array<SpeechSynthesisVoice>;
      synthesisParams: SpeechSynthesisUtterance;
    }) => void;
    volume?: number;
    lang?: SupportedRegions;
    rate?: number;
    pitch?: number;
    voice?: string;
    splitSentences?: boolean;
    listeners?: {
      onvoiceschanged?: (voices: Array<SpeechSynthesisVoice>) => void;
    };
  }): Promise<{
		voices: Array<SpeechSynthesisVoice>;
		synthesisParams: SpeechSynthesisUtterance;
	}>;

	pause(): void;

	resume(): void;

	cancel(): void;

	pending(): boolean;

	paused(): boolean;

	speaking(): boolean;

	setPitch(pitch: number): void;

	setVoice(voice: string): void;

	setVolume(volume: number): void;

	setRate(rate: number): void;

	setLanguage(lang: SupportedRegions): void;

	speak(options: {
		text: string;
		queue?: boolean;
    volume?: number;
    lang?: SupportedRegions;
    rate?: number;
    pitch?: number;
    voice?: string;
    splitSentences?: boolean;
		listeners?: {
			onstart?: () => void;
			onend?: () => void;
			onresume?: () => void;
			onboundary?: (event: { name: string; elapsedTime: number }) => void;
		};
	}): Promise<void>;
}

declare interface SpeechSynthesisVoice {
	default: boolean;
	voiceURI: string;
	name: string;
	lang: string;
	localService: boolean;
	globalService: boolean;
}

declare interface SpeechSynthesisUtterance {
	text: string;
	lang: string;
	voiceURI: string;
	volume: number;
	rate: number;
	pitch: number;
}

declare type SupportedRegions =
	| 'ar-SA'
	| 'cs-CZ'
	| 'da-DK'
	| 'de-DE'
	| 'el-GR'
	| 'en'
	| 'en-AU'
	| 'en-GB'
	| 'en-IE'
	| 'en-IN'
	| 'en-US'
	| 'en-ZA'
	| 'es-AR'
	| 'es-ES'
	| 'es-MX'
	| 'es-US'
	| 'fi-FI'
	| 'fr-CA'
	| 'fr-FR'
	| 'he-IL'
	| 'hi-IN'
	| 'hu-HU'
	| 'id-ID'
	| 'it-IT'
	| 'ja-JP'
	| 'ko-KR'
	| 'nb-NO'
	| 'nl-BE'
	| 'nl-NL'
	| 'pl-PL'
	| 'pt-BR'
	| 'pt-PT'
	| 'ro-RO'
	| 'ru-RU'
	| 'sk-SK'
	| 'sv-SE'
	| 'th-TH'
	| 'tr-TR'
	| 'zh-CN'
	| 'zh-HK'
	| 'zh-TW';

declare module 'speak-tts' {
	export default Speech;
}
