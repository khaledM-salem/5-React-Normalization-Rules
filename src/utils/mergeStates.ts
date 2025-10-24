export function mergeStates<T extends Record<string, any>>(a: T, b: T): T {
return { ...a, ...b };
}