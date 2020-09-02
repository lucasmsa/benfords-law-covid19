const countOccurrences = (arr: number[], val: number) => arr.reduce((a: number, v: number) => (v === val ? a + 1 : a), 0);

export default countOccurrences