import axios from "axios";
import type { IUserInfo, IRawVoice } from "../../types/ElevenLabs";

const ELEVENLABS_API = "https://api.elevenlabs.io";
const ELEVENLABS_API_VERSION = "v1";
const ELEVENLABS_BASE_URL = `${ELEVENLABS_API}/${ELEVENLABS_API_VERSION}`;

const defaultHeaders = {
    "Content-Type": "application/json",
}

async function get(path: string, apiKey: string) {
    try {
        const response = await axios.get(`${ELEVENLABS_BASE_URL}${path}`, {
            headers: {
                ...defaultHeaders,
                "xi-api-key": apiKey,
            }
        })
        return response.data;
    } catch (axiosError: any) {
        console.error({ getError: axiosError });
        throw axiosError.response.data.detail;
    }

}

async function postResponseAudio(path: string, postData: any, apiKey: string) {
    try {
        const audioResponse = await axios.post(`${ELEVENLABS_BASE_URL}${path}`, postData, {
            headers: {
                ...defaultHeaders,
                "xi-api-key": apiKey,
                "Accept": "audio/mpeg",
            },
            responseType: "arraybuffer",
        })

        console.log({ audioResponse });
        return audioResponse.data;
    } catch (axiosError: any) {
        console.error({ postResponseAudioError: axiosError });
        if (axiosError.response && axiosError.response.data) {
            const decoder = new TextDecoder('utf-8');
            const jsonErrorResponse = JSON.parse(decoder.decode(new Uint8Array(axiosError.response.data)));
            console.error({ jsonErrorResponse });
            throw jsonErrorResponse.detail;
        } else {
            throw axiosError.response.data.detail;
        }
    }

}


export const ElevenLabsApi = (apiKey: string) => {
    async function getUserInfoAsync() {
        const gotUserInfo = await get("/user", apiKey);
        console.log({ gotUserInfo });
        return gotUserInfo as IUserInfo;
    }

    async function getVoicesAsync() {
        const gotVoicesData = await get("/voices", apiKey);
        // console.log({ gotVoicesData });
        const voicesWithSettings: IRawVoice[] = [];
        // Try to find a way to do with Promise.all?
        for (const vc of gotVoicesData.voices) {
            const vcSettings = await get(`/voices/${vc.voice_id}/settings`, apiKey);
            voicesWithSettings.push({ ...vc, settings: vcSettings });
        }
        console.log({ voicesWithSettings });
        return voicesWithSettings as IRawVoice[];
    }

    async function textToSpeechAsync(voiceId: string, text: string, voiceSettings: any) {
        try {
            return await postResponseAudio(`/text-to-speech/${voiceId}`, {
                text,
                voice_settings: voiceSettings,
            }, apiKey);
        } catch (textToSpeechError: any) {
            console.error({ textToSpeechError });
            throw textToSpeechError;
        }
    }

    return {
        getUserInfoAsync,
        getVoicesAsync,
        textToSpeechAsync,
    }
}
