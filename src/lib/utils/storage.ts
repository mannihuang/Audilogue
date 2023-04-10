enum LocalStorageKeys {
    Voices = "Voices",
    SubscriptionInfo = "SubscriptionInfo",
    Paragraphs = "Paragraphs",
}

function saveToLocalStorage(key: LocalStorageKeys, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
}

function readFromLocalStorage(key: LocalStorageKeys) {
    const storedData = localStorage.getItem(key);
    return !storedData ? [] : JSON.parse(storedData);
}

export {
    LocalStorageKeys,
    saveToLocalStorage,
    readFromLocalStorage,
}