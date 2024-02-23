// import set from './set'

import { cloneDeep } from "lodash"

export const generateId = () => {
    const d =
        typeof performance === 'undefined'
            ? Date.now()
            : performance.now() * 1000

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16 + d) % 16 | 0

        // eslint-disable-next-line eqeqeq
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
export function createState(stateObj: Record<string, any>) {
    const createDataProxyHandler = (path?: string) => ({
        get: (obj: Record<string, any>, key: string): Record<string, any> => {
            const fullPath = path ? path + '.' + String(key) : key
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                return new Proxy(obj[key], createDataProxyHandler(fullPath))
            } else {
                return obj[key]
            }
        },
        set(obj: Record<string, any>, key: string, value: any) {
            const fullPath = path ? path + '.' + String(key) : key

            obj[key] = value
            if (stateObj.watch) {
                stateObj.watch(cloneDeep(stateObj.data), fullPath)
            }

            return true
        },
    })

    const data = stateObj.data || {}
    const handler = {
        set: (_: never, key: string, value: any) => {
            if (key in data) {
                return createDataProxyHandler().set(data, key, value)
            }
            data[key] = value
            return true
        },
        get: (_: never, key: string) => {
            if (key in data) {
                return createDataProxyHandler().get(data, key)
            }
            return data[key]
        },
    }

    return new Proxy(stateObj, handler)
}
