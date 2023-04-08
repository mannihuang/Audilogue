import { derived, writable } from 'svelte/store';
import { VoiceCategory, type ISubscriptionInfo, type IUserInfo } from '../types/ElevenLabs';
import type { IVoice } from '../types/custom';

const elevenlabsApiKey = writable("");
// const userInfo = writable<IUserInfo>();
const userSubscriptionInfo = writable<ISubscriptionInfo>();
const allVoices = writable<IVoice[]>([]);
const showSampleVoices = writable<boolean>(true);
const showUserClonedVoices = writable<boolean>(true);
const voiceChoices = derived([allVoices, showSampleVoices, showUserClonedVoices], ([$allVoices, $showSampleVoices, $showUserClonesVoices]) => $allVoices.filter(vc => {
    const isSample = vc.category == VoiceCategory.Sample;
    const isCloned = vc.category == VoiceCategory.UserCloned;
    return ($showSampleVoices && isSample) || ($showUserClonesVoices && isCloned);
}));

export {
    elevenlabsApiKey,
    // userInfo,
    userSubscriptionInfo,
    allVoices,
    showSampleVoices,
    showUserClonedVoices,
    voiceChoices,
}