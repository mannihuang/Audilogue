
// export enum FileReadAsTypes {
//     Text = "text",
//     DataURL = "dataURL",
//     ArrayBuffer = "arrayBuffer",
//     BinaryString = "binaryString",
// }

// export async function readFileAsAsync(file: File, readAs: FileReadAsTypes) {
//     const fileReader = new FileReader();
//     return new Promise((resolve, reject) => {
//         if (!file) {
//             reject("No file to be read");
//         }

//         fileReader.onload = function () {
//             resolve(fileReader.result);
//         }
//         switch (readAs) {
//             case FileReadAsTypes.Text:
//                 fileReader.readAsText(file);
//                 break;
//             case FileReadAsTypes.DataURL:
//                 fileReader.readAsDataURL(file);
//                 break;
//             case FileReadAsTypes.ArrayBuffer:
//                 fileReader.readAsArrayBuffer(file);
//                 break;
//             case FileReadAsTypes.BinaryString:
//                 fileReader.readAsBinaryString(file);
//                 break;
//         }
//     })
// }

export async function readFileAsTextAsync(file: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file to be read");
        }

        fileReader.onload = function () {
            resolve(fileReader.result as string);
        }
        fileReader.readAsText(file);
    })
}

export async function readFileAsDataURLAsync(file: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file to be read");
        }

        fileReader.onload = function () {
            resolve(fileReader.result as string);
        }
        fileReader.readAsDataURL(file);
    })
}

export async function readFileAsArrayBufferAsync(file: File): Promise<ArrayBuffer> {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file to be read");
        }

        fileReader.onload = function () {
            resolve(fileReader.result as ArrayBuffer);
        }
        fileReader.readAsArrayBuffer(file);
    })
}