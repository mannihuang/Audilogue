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

export interface IVoice extends IRawVoice {
    color: string;
}

export interface IGeneration {
    id: string;
    voiceId: string;
    audioUri: string;
    // historyItemId;
}

export interface ISpeech {
    id: string;
    text: string;
    isInSpeechMarks: boolean;
    voiceId?: string;
    stability?: number;
    similarityBoost?: number;
    currentGeneration?: IGeneration;
    generationHistory: IGeneration[];
}

export interface IParagraph {
    id: string;
    speeches: ISpeech[];
}