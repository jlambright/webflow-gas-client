namespace Helpers {
    export function interfaceCheck<T>(object: object, i_keys: Array<keyof T>): boolean {
        return <Array<keyof T>>Object.keys(object) == i_keys
    }
}