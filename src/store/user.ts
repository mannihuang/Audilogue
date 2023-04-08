import { writable } from 'svelte/store';
import type { ISubscriptionInfo, IUserInfo } from '../types/ElevenLabs';
import type { IVoice } from '../types/custom';

const elevenlabsApiKey = writable("");
// const userInfo = writable<IUserInfo>();
const userSubscriptionInfo = writable<ISubscriptionInfo>();
const allVoices = writable<IVoice[]>([]);

export {
    elevenlabsApiKey,
    // userInfo,
    userSubscriptionInfo,
    allVoices
}