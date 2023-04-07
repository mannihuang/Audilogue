import { writable } from "svelte/store";
import type { IParagraph } from "../types/custom";

const paragraphs = writable<IParagraph[]>([]);

export {
    paragraphs,
}