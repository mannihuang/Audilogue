import { writable } from 'svelte/store';
import type { IRawVoice, ISubscriptionInfo, IUserInfo } from '../types/ElevenLabs';

const elevenlabsApiKey = writable("");
// const userInfo = writable<IUserInfo>();
const userSubscriptionInfo = writable<ISubscriptionInfo>();
const allVoices = writable<IRawVoice[]>([]);

export {
    elevenlabsApiKey,
    // userInfo,
    userSubscriptionInfo,
    allVoices
}