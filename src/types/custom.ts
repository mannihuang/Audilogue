import type { Readable, Writable } from "svelte/store";
import type { IRawVoice, IUserInfo } from "./ElevenLabs";

export interface IErrorStore {
    errorMessage: string;
    showError: boolean;
}

export interface IElevenLabsWrapper {
    getUserInfoAsync: () => Promise<IUserInfo>;
    getVoicesAsync: () => Promise<IRawVoice[]>;
    textToSpeechAsync: (voiceId: string, text: string, voiceSettings: any) => Promise<any>;
}

export interface IElevenLabsContext {
    eApi: IElevenLabsWrapper;
}

export interface ISpeech {
    id: string;
    text: string;
}

export interface IParagraph {
    id: string;
    speeches: ISpeech[];
}