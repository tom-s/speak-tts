type SpeechEvents = 'onboundary' | 'onend' | 'onerror' | 'onmark' | 'onpause' | 'onresume' | 'onstart';

export default class Speech {
    hasBrowserSupport(): boolean;

    init(props?: Partial<{
        volume: number,
        lang: string,
        rate: number,
        pitch: number,
        voice: string,
        splitSentences: boolean,
        listeners: {
            onvoiceschanged?: SpeechSynthesis['onvoiceschanged'];
        }
    }>): Promise<{
        voices: SpeechSynthesisVoice[],
        lang: string,
        voice: string,
        volume: number,
        rate: number,
        pitch: number,
        splitSentences: boolean,
        browserSupport: boolean,
    }>;

    speak(props: {
        text: string,
        queue?: boolean,
        listeners?: Partial<{
            [key in SpeechEvents]: SpeechSynthesisUtterance[key]
        }>,
    }): Promise<void>;

    static setLanguage(lang: string): void;

    static setVoice(voice: string): void;

    static setRate(val: number): void;

    static setVolume(val: number): void;

    static setPitch(val: number): void;

    static pause(): void;

    static resume(): void;

    static cancel(): void;

    static pending(): boolean;

    static paused(): boolean;

    static speaking(): boolean;
}
