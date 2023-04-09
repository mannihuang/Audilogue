import { derived, writable } from 'svelte/store';
import { VoiceCategory, type ISubscriptionInfo, type IUserInfo } from '../types/ElevenLabs';
import type { IElevenLabsWrapper, IVoice } from '../types/custom';

const elevenlabsApiKey = writable("");
const eApi = writable<IElevenLabsWrapper>();
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
    eApi,
    // userInfo,
    userSubscriptionInfo,
    allVoices,
    showSampleVoices,
    showUserClonedVoices,
    voiceChoices,
}