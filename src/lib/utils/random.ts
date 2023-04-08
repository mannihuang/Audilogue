function generateRandomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<Type>(items: Type[]): Type {
    const min = 0;
    const max = items.length;
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    return items[randomIndex];
}

const generateRandomHex = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};

export {
    generateRandomNumberBetween,
    getRandomItem,
    generateRandomHex,
}