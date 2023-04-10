import { derived, get, writable } from "svelte/store";
import type { ISpeech, IParagraph } from "../types/custom";
import { trimText } from "$lib/utils/text";
import { v4 as uuidv4 } from "uuid";
import { allVoices } from "./user";

const paragraphs = writable<IParagraph[]>([]);
const speeches = writable<ISpeech[]>([]);

const currentSpeechIndex = writable<number>();
const currentSpeech = derived([speeches, currentSpeechIndex], ([$speeches, $currentSpeechIndex]) => $speeches[$currentSpeechIndex]);
const currentSpeechText = derived([currentSpeech], ([$currentSpeech]) => trimText($currentSpeech?.text || ''));
function setCurrentSpeech(speechId: string) {
    console.log({ speechId })
    console.log({ speeches: get(speeches) })
    const index = get(speeches).findIndex(sp => sp.id == speechId);
    console.log({ index })
    currentSpeechIndex.set(index);
    console.log({ currentSpeech: get(currentSpeech)})
    selectedSpeeches.set([ get(currentSpeech) ]);
}

type IPartialSpeech = {
    [key in keyof ISpeech]?: ISpeech[key];
}
function updateSpeechData(speechId: string, updatedSpeechData: IPartialSpeech) {
    speeches.update(oldSpeeches => oldSpeeches.map(sp => {
        return sp.id == speechId ? {
            ...sp,
            ...updatedSpeechData,
        } : sp
    }))
    paragraphs.update(oldParagraphs => oldParagraphs.map(para => {
        return !para.speeches.some(sp => sp.id == speechId) ? para : {
            ...para,
            speeches: para.speeches.map(sp => sp.id == speechId ? { ...sp, ...updatedSpeechData } : sp)
        }
    }))
}

const selectedSpeeches = writable<ISpeech[]>([]);
function appendToSelectedSpeeches(newlySelectedSpeech: ISpeech) {
    selectedSpeeches.update(oldArr => [...oldArr, newlySelectedSpeech]);
    if(get(selectedSpeeches).length == 1) {
        // currentSpeechIndex.set(0);
        setCurrentSpeech(newlySelectedSpeech.id);
    }
}
function removeFromSelectedSpeeches(speechId: string) {
    selectedSpeeches.update(oldArr => oldArr.filter(sp => sp.id != speechId));
}

function appendToGenerationHistory(speechId: string, audioUri: string) {
    const foundSpeech = get(speeches).find(sp => sp.id == speechId);
    if(!foundSpeech) {
        throw new Error("Speech not found");
    }
    const voiceName = get(allVoices).find(vc => vc.voice_id == foundSpeech.voiceId)?.name;
    const newgenId = `${voiceName} - ${uuidv4()}`;
    const newGen = {
        id: newgenId,
        audioUri,
        voiceId: foundSpeech.voiceId!,
    }
    updateSpeechData(speechId, {
        currentGeneration: newGen,
        generationHistory: [
            ...foundSpeech.generationHistory,
            newGen,
        ]
    })
}

export {
    paragraphs,
    speeches,
    currentSpeech,
    currentSpeechText,
    setCurrentSpeech,
    updateSpeechData,
    selectedSpeeches,
    appendToSelectedSpeeches,
    removeFromSelectedSpeeches,
    appendToGenerationHistory,
}