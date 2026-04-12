import kebabcase from "lodash.kebabcase";

export const slugifyStr = (str: string) => `note-${kebabcase(str)}`;

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
