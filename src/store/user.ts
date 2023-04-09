import { derived, get, writable } from 'svelte/store';
import { VoiceCategory, type ISubscriptionInfo, type IUserInfo } from '../types/ElevenLabs';
import type { IElevenLabsWrapper, IVoice } from '../types/custom';
import { speeches, updateSpeechData } from './speeches';

const elevenlabsApiKey = writable("");
const eApi = writable<IElevenLabsWrapper>();
// const userInfo = writable<IUserInfo>();
const userSubscriptionInfo = writable<ISubscriptionInfo>();
const allVoices = writable<IVoice[]>([]);

type IPartialVoice = {
    [key in keyof IVoice]?: IVoice[key];
}

function updateVoice(voiceId: string, newVoiceData: IPartialVoice) {
    allVoices.update((oldVoices) =>
      oldVoices.map((vc) =>
        vc.voice_id == voiceId
          ? {
              ...vc,
              ...newVoiceData
            }
          : vc
      )
    );
    // use subscribe?
    for(const sp of get(speeches)) {
        if(sp.voiceId == voiceId) {
            updateSpeechData(sp.id, {});
        }
    }
  }
  
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
    updateVoice,
    showSampleVoices,
    showUserClonedVoices,
    voiceChoices,
}