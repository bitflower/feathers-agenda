// TODO: Use structured clone instead of JSON.parse(JSON.stringify(obj))
export const clone = (obj) => JSON.parse(JSON.stringify(obj));
