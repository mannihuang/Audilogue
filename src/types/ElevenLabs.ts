interface IVoiceSettings {
    stability: number;
    similarity_boost: number;
}

export enum VoiceCategory {
    Sample = "premade",
    UserCloned = "cloned",
}

export interface IRawVoice {
    voice_id: string;
    name: string;
    category: VoiceCategory;
    settings: IVoiceSettings;
}

export interface ISubscriptionInfo {
    character_count: number;
    character_limit: number;
}

export interface IUserInfo {
    subscription: ISubscriptionInfo;
}