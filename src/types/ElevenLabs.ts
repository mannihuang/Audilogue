interface IVoiceSettings {
    stability: number;
    similarity_boost: number;
}

export interface IRawVoice {
    voice_id: string;
    name: string;
    settings: IVoiceSettings;
}

export interface ISubscriptionInfo {
    character_count: number;
    character_limit: number;
}

export interface IUserInfo {
    subscription: ISubscriptionInfo;
}