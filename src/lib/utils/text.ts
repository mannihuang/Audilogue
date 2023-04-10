function trimText(text: string) {
    return text.replaceAll('"', '').trim();
}

export {
    trimText,
}