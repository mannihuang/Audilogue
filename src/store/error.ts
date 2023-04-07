import { writable } from 'svelte/store';
import type { IErrorStore } from '../types/custom';

const globalError = writable<IErrorStore>({
    errorMessage: "",
    showError: false,
});

function setError(error: any, displaySeconds: number = 5) {
    globalError.set({
        errorMessage: error.message,
        showError: true,
    })
}

export {
    globalError,
    setError,
}